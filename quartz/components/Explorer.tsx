import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/explorer.scss"

// REMOVE collapse script — do NOT import explorer.inline
// import script from "./scripts/explorer.inline"

import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { FileTrieNode } from "../util/fileTrie"
import OverflowListFactory from "./OverflowList"

// NOTE: collapse behavior scripts removed

type OrderEntries = "sort" | "filter" | "map"

export interface Options {
  title?: string
  sortFn: (a: FileTrieNode, b: FileTrieNode) => number
  filterFn: (node: FileTrieNode) => boolean
  mapFn: (node: FileTrieNode) => void
  order: OrderEntries[]
}

const defaultOptions: Options = {
  mapFn: (node) => node,
  sortFn: (a, b) => {
    if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }
    return a.isFolder ? -1 : 1
  },
  filterFn: (node) => node.slugSegment !== "tags",
  order: ["filter", "map", "sort"],
}

let numExplorers = 0
export default ((userOpts?: Partial<Options>) => {
  const opts: Options = { ...defaultOptions, ...userOpts }
  const { OverflowList } = OverflowListFactory()

  const Explorer: QuartzComponent = ({ cfg, displayClass }: QuartzComponentProps) => {
    const id = `explorer-${numExplorers++}`

    return (
      <div
        class={classNames(displayClass, "explorer")}
        data-behavior="always-open"
      >
        {/* REMOVE title collapse button — replace with static title */}
        <div class="explorer-title">
          <h2>{opts.title ?? i18n(cfg.locale).components.explorer.title}</h2>
        </div>

        {/* ALWAYS EXPANDED CONTENT */}
        <div id={id} class="explorer-content" aria-expanded={true} role="group">
          <OverflowList class="explorer-ul" />
        </div>

        {/* FILE TEMPLATE (unchanged) */}
        <template id="template-file">
          <li>
            <a href="#"></a>
          </li>
        </template>

        {/* FOLDER TEMPLATE — remove folder-button + collapsing container */}
        <template id="template-folder">
          <li>
            <div class="folder-container always-open">
              <div class="folder-icon-placeholder"></div>
              <span class="folder-title"></span>
            </div>

            {/* children ALWAYS visible */}
            <ul class="content always-visible"></ul>
          </li>
        </template>
      </div>
    )
  }

  Explorer.css = style

  // REMOVE collapse-related script
  Explorer.afterDOMLoaded = () => {}

  return Explorer
}) satisfies QuartzComponentConstructor
