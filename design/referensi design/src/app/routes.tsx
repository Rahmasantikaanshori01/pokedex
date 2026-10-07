import { createBrowserRouter } from "react-router"
import { PokedexProvider } from "./PokedexContext"
import { AppShell } from "../components/UI"
import HomePage from "../pages/HomePage"
import DetailPage from "../pages/DetailPage"
import CollectionPage from "../pages/CollectionPage"
import HistoryPage from "../pages/HistoryPage"

function Root() {
  return (
    <PokedexProvider>
      <AppShell />
    </PokedexProvider>
  )
}

function NotFound() {
  return (
    <div className="page content-section error-state">
      <h1>404</h1>
      <h2>That route is unexplored</h2>
      <p>There are no Pokémon hiding here.</p>
      <a className="button button-primary" href="/">
        Return home
      </a>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "pokemon/:id", Component: DetailPage },
      { path: "collection", Component: CollectionPage },
      { path: "history", Component: HistoryPage },
      { path: "*", Component: NotFound },
    ],
  },
])
