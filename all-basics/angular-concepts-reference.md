# Angular — Complete Concepts Reference

## 1. Architecture Overview

Angular is a component-based framework built around TypeScript. A typical app is a tree of components, backed by services for shared logic, wired together by dependency injection, and navigated via a router.

Core building blocks:
- **Components** — UI + logic units
- **Templates** — HTML with Angular syntax (bindings, directives)
- **Services** — reusable business logic, injected where needed
- **Modules (NgModules)** — traditional way to group things (optional since standalone components)
- **Standalone Components** — modern default, no NgModule required
- **Routing** — URL-to-component mapping
- **Signals / RxJS** — reactivity and async data handling

---

## 2. Components

The fundamental UI building block.

```ts
@Component({
  selector: 'app-hello',
  standalone: true,
  template: `<h1>Hello, {{ name }}</h1>`,
  styleUrl: './hello.component.css',
})
export class HelloComponent {
  name = 'World';
}
```

Key pieces:
- `selector` — the custom HTML tag used to place this component (`<app-hello>`)
- `template` / `templateUrl` — inline or external HTML
- `styles` / `styleUrl` / `styleUrls` — component-scoped CSS
- `standalone: true` — the modern default; no NgModule declaration needed (default since Angular 19)

### Inputs & Outputs (component communication)

Modern signal-based (v17.1+):
```ts
name = input<string>('default');       // input signal, optionally with default
name = input.required<string>();       // required input, no default
saved = output<string>();              // event emitter equivalent

save() {
  this.saved.emit(this.name());
}
```
```html
<app-hello [name]="userName" (saved)="onSaved($event)" />
```

Classic decorator-based (still supported):
```ts
@Input() name!: string;
@Output() saved = new EventEmitter<string>();
```

### Two-way binding — `model()`
```ts
value = model<string>('');
```
```html
<app-input [(value)]="parentValue" />
```
Equivalent to the classic `[(ngModel)]` pattern but for custom components.

---

## 3. Templates & Data Binding

### Interpolation
```html
<p>{{ user.name }}</p>
```

### Property binding
```html
<img [src]="imageUrl">
<button [disabled]="isLoading">Submit</button>
```

### Event binding
```html
<button (click)="onClick($event)">Click</button>
```

### Two-way binding (`ngModel`)
```html
<input [(ngModel)]="username">
```
Requires `FormsModule`.

### Template reference variables
```html
<input #emailInput>
<button (click)="log(emailInput.value)">Log</button>
```

---

## 4. Control Flow (Modern Syntax, v17+)

Built-in block syntax replaced `*ngIf`/`*ngFor`/`*ngSwitch` (which still work but are considered legacy):

```html
@if (user) {
  <p>Welcome, {{ user.name }}</p>
} @else {
  <p>Please log in</p>
}

@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items</li>
}

@switch (status) {
  @case ('loading') { <p>Loading...</p> }
  @case ('error') { <p>Error!</p> }
  @default { <p>Ready</p> }
}
```

Legacy structural directives (pre-v17, still functional):
```html
<p *ngIf="user">Welcome, {{ user.name }}</p>
<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
```

### Deferrable views (`@defer`)
Lazy-loads a template block and its dependencies, splitting the bundle automatically.

```html
@defer (on viewport) {
  <heavy-chart [data]="data" />
} @placeholder {
  <p>Scroll to load chart</p>
} @loading (minimum 500ms) {
  <spinner />
}
```
Triggers: `on idle`, `on viewport`, `on interaction`, `on hover`, `on timer(2s)`, or manual condition.

---

## 5. Directives

### Attribute directives
Change the appearance/behavior of an element.
```ts
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  private el = inject(ElementRef);
  @HostListener('mouseenter') onEnter() {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }
}
```
```html
<p appHighlight>Hover me</p>
```

### Structural directives
Change the DOM layout (add/remove elements) — `*ngIf`, `*ngFor`, or custom ones built with `TemplateRef`/`ViewContainerRef`. Mostly superseded by `@if`/`@for` for built-ins, but custom structural directives are still written the same way.

### Built-in directives
- `NgClass` — `[ngClass]="{'active': isActive}"`
- `NgStyle` — `[ngStyle]="{'color': color}"`

---

## 6. Pipes

Transform values declaratively in templates.

```html
{{ price | currency:'USD' }}
{{ date | date:'longDate' }}
{{ name | uppercase }}
{{ description | slice:0:100 }}
{{ user$ | async }}
```

Custom pipe:
```ts
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20): string {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}
```
Pipes are **pure** by default (only re-run when input reference changes) — mark `pure: false` for impure pipes that need to re-run every change-detection cycle (costly, avoid when possible).

---

## 7. Signals (Reactivity — v16+, primary model since v17+)

```ts
import { signal, computed, effect } from '@angular/core';

count = signal(0);                              // writable signal
doubled = computed(() => this.count() * 2);      // derived, cached, read-only

increment() { this.count.update(v => v + 1); }

constructor() {
  effect(() => console.log('count is', this.count())); // reactive side effect
}
```

Signal-based inputs/queries (modern replacements for decorators):
```ts
name = input<string>();
child = viewChild<ElementRef>('ref');
children = viewChildren(ItemComponent);
parent = contentChild(SomeDirective);
```

RxJS interop:
```ts
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

data = toSignal(this.http.get('/api/data'), { initialValue: [] });
data$ = toObservable(this.someSignal);
```

### `resource()` (v19+, developer preview)
Reactive async data loading tied to signal inputs.
```ts
userResource = resource({
  request: () => ({ id: this.userId() }),
  loader: ({ request }) => fetchUser(request.id),
});
```
`.value()`, `.isLoading()`, `.error()`, `.reload()`.

---

## 8. Dependency Injection

Angular's DI system provides services to components/directives/pipes hierarchically.

```ts
@Injectable({ providedIn: 'root' })  // singleton, tree-shakable
export class UserService {
  getUser() { /* ... */ }
}

@Component({...})
export class ProfileComponent {
  private userService = inject(UserService);  // modern function-based injection
  // or classic constructor injection:
  constructor(private userService: UserService) {}
}
```

Provider scopes:
- `providedIn: 'root'` — app-wide singleton
- Provided in a component's `providers: []` array — new instance per component subtree
- `providedIn: 'platform'` — shared across multiple Angular apps on a page

Injection tokens (for non-class dependencies):
```ts
export const API_URL = new InjectionToken<string>('API_URL');

providers: [{ provide: API_URL, useValue: 'https://api.example.com' }]

private apiUrl = inject(API_URL);
```

---

## 9. Lifecycle Hooks

Class methods called at specific points in a component/directive's life:

```ts
export class MyComponent implements OnInit, OnChanges, DoCheck,
  AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {

  ngOnChanges(changes: SimpleChanges) {}   // input properties changed
  ngOnInit() {}                            // once, after first ngOnChanges
  ngDoCheck() {}                           // custom change detection
  ngAfterContentInit() {}                  // after content projected via <ng-content> is initialized
  ngAfterContentChecked() {}
  ngAfterViewInit() {}                     // after component's view (and children) initialized
  ngAfterViewChecked() {}
  ngOnDestroy() {}                         // cleanup — unsubscribe, clear timers
}
```
Newer function-based alternatives (v19+): `afterNextRender()`, `afterRenderEffect()` for render-timing hooks without implementing an interface.

---

## 10. Forms

### Template-driven forms
```html
<form #f="ngForm" (ngSubmit)="onSubmit(f.value)">
  <input name="email" ngModel required email>
</form>
```
Requires `FormsModule`. Good for simple forms.

### Reactive forms
```ts
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', Validators.minLength(8)),
});

onSubmit() {
  if (this.form.valid) {
    console.log(this.form.value);
  }
}
```
```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="email">
  <input formControlName="password" type="password">
</form>
```
Requires `ReactiveFormsModule`. Preferred for complex/dynamic forms, easier to unit test.

Typed forms (v14+) infer/enforce value types automatically from the `FormGroup`/`FormControl` definitions.

---

## 11. Routing

```ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES) },
  { path: '**', component: NotFoundComponent }, // wildcard/404
];
```

```ts
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
});
```

```html
<router-outlet></router-outlet>
<a routerLink="/users/5" routerLinkActive="active">Go</a>
```

Key concepts:
- **Route parameters** — `:id`, read via `ActivatedRoute` or `input()` binding (`withComponentInputBinding()`)
- **Guards** — `CanActivate`, `CanDeactivate`, `CanMatch` (function-based since v14.2+, e.g. `canActivate: [authGuard]`)
- **Resolvers** — pre-fetch data before a route activates
- **Lazy loading** — `loadChildren` / `loadComponent` split code by route
- **Child routes** — nested `children: [...]` for layouts with sub-views

---

## 12. HTTP & Data Fetching

```ts
export class UserService {
  private http = inject(HttpClient);
  getUsers() {
    return this.http.get<User[]>('/api/users');
  }
}
```
Setup:
```ts
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
});
```

Interceptors (function-based, v15+):
```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token;
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
```

`HttpClient` returns Observables — combine with `async` pipe, `toSignal()`, or manual `.subscribe()`.

---

## 13. RxJS in Angular

Angular is built heavily around RxJS Observables for async streams (HTTP, forms, events, router).

Common operators used in Angular apps:
```ts
this.searchTerm$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term)),
).subscribe(results => this.results = results);
```

`async` pipe auto-subscribes/unsubscribes in templates:
```html
<div *ngFor="let item of items$ | async">{{ item.name }}</div>
```

---

## 14. Dependency Injection Hierarchy & Change Detection

### Change Detection
Angular checks the component tree for changes and updates the DOM.

- **Default strategy** — checks the whole tree on any event/async callback
- **`OnPush` strategy** — only re-checks a component when its `@Input()`s change by reference, an event originates from it, or a signal it reads changes
```ts
@Component({ changeDetectionStrategy: ChangeDetectionStrategy.OnPush, ... })
```
With signals, Angular is moving toward **zoneless** change detection (no `zone.js` needed) — signals notify Angular exactly what changed, without needing to check the whole tree.

### Zone.js
Historically, Angular patches async APIs (`setTimeout`, promises, DOM events) via `zone.js` to know when to run change detection. Zoneless Angular (`provideZonelessChangeDetection()`, stable as of Angular 20) removes this dependency, relying on signals instead.

---

## 15. Content Projection

Passing markup into a component from its parent, like a "slot" mechanism.

```ts
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content select="[card-title]"></ng-content>
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {}
```
```html
<app-card>
  <h2 card-title>Title</h2>
  <p>Body content projected here</p>
</app-card>
```

---

## 16. Standalone APIs & Bootstrapping (Modern Angular, v15+)

```ts
// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideZonelessChangeDetection(), // v18+, stable v20
  ],
});
```
NgModules (`@NgModule`) are still supported but no longer the default — components, directives, and pipes are `standalone: true` by default since Angular 19, and apps are commonly bootstrapped without any `AppModule` at all.

---

## 17. Testing

```ts
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UserService] });
    service = TestBed.inject(UserService);
  });

  it('should fetch users', () => {
    expect(service).toBeTruthy();
  });
});
```
- `TestBed` — Angular's testing utility for configuring a test module
- `ComponentFixture` — wraps a component instance + its DOM for assertions
- Default test runner: Karma + Jasmine (Jest and Web Test Runner are increasingly common alternatives)

---

## 18. Animations

```ts
trigger('fade', [
  state('void', style({ opacity: 0 })),
  transition(':enter', [animate('300ms', style({ opacity: 1 }))]),
])
```
```ts
@Component({ animations: [fadeAnimation], ... })
```
Newer alternative: native CSS transitions combined with `@if`/`@for`'s built-in enter/leave animation support, reducing reliance on `@angular/animations` for simple cases.

---

## 19. Angular CLI (Tooling)

Covered in depth separately, but core commands:
```bash
ng new my-app
ng serve
ng generate component my-component
ng build --configuration=production
ng test
ng add @angular/material
ng update
```

---

## 20. State Management Patterns

- **Local component state** — `signal()` inside a component
- **Service-based state** — a singleton service holding signals, injected wherever needed (often sufficient for small/medium apps)
- **NgRx Store** — Redux-style global store, actions/reducers/effects/selectors
- **NgRx SignalStore** — newer, signal-based alternative to classic NgRx, less boilerplate
- **Akita / Elf** — alternative third-party state libraries (less common now that signals exist natively)

---

## Quick Reference Table

| Concept | Purpose |
|---|---|
| Component | UI unit — template + logic |
| Signal | Reactive state primitive |
| `computed()` | Derived, cached reactive value |
| `effect()` | Reactive side effect |
| Directive | Reusable DOM behavior/appearance |
| Pipe | Declarative template value transform |
| Dependency Injection | Hierarchical service sharing |
| Lifecycle hooks | Class methods tied to component life stages |
| Reactive Forms | Programmatic, typed, testable forms |
| Template-driven Forms | Simple forms driven by template directives |
| Router | URL ↔ component mapping, guards, lazy loading |
| `HttpClient` | Observable-based HTTP requests |
| RxJS | Async/event stream library used throughout Angular |
| Change Detection | Mechanism that syncs state → DOM |
| Zone.js / Zoneless | How Angular knows when to check for changes |
| Content Projection | `<ng-content>` slot-style composition |
| Standalone Components | Modern default, no NgModule required |
| `@defer` | Lazy-loaded template blocks |
| NgRx / SignalStore | Global state management patterns |
