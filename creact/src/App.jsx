import CourseCard from './Components/CourseCard'
// import './App.css'

function App() {

  return (
    <>
      <section className='mainBody'>
        <CourseCard>
          <p>this is from child:</p>
        </CourseCard>
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </section>
    </>
  )
}

export default App
