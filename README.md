# LayoutPractice

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Member API

The Express SSR server provides the member API and stores data in
`data/members.sqlite` using Node.js's built-in SQLite support. Use Node.js 22.13+
to run the server.

Build and start the SSR server:

```bash
npm run build
npm run serve:ssr:layout-practice
```

For frontend development with `ng serve`, keep the SSR server running on port 4000. The development proxy forwards `/api` requests to it.

Available endpoints:

- `GET /api/members`
- `POST /api/members`
- `DELETE /api/members/:id`

## Rendering mode

The app currently uses CSR so pages render in the browser. The previous SSR and
prerender route configuration is kept commented out in
`src/app/app.routes.server.ts` for comparison. The Express API and SQLite
database are used in both modes.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
