import falcon

class HelloResource:
    def on_get(self, req, resp):
        resp.media = {"message": "Hello, World!"}

app = falcon.App()
app.add_route("/hello", HelloResource())