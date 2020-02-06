from galini_dashboard.API.server import create_app


def main():
    app = create_app()
    app.run()
