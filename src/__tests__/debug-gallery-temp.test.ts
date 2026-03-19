import { describe, it } from "vitest"
import * as React from "react"
import { render } from "@testing-library/react"

describe("debug gallery rendering", () => {
  it("shows gallery DOM ids and h2s", async () => {
    const { default: TemplatesPage } = await import("@/app/templates/page")
    const { container } = render(React.createElement(TemplatesPage))
    const elems = container.querySelectorAll("[id]")
    elems.forEach((el) => {
      console.log("ID:", el.id, "TAG:", el.tagName)
    })
    const h2s = container.querySelectorAll("h2")
    h2s.forEach((h, i) =>
      console.log("H2", i, ":", JSON.stringify(h.textContent?.trim().substring(0, 60)))
    )
  })
})
