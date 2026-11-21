# AIGZT — ChatGPT-style interaction v15
Primary chat route shows a single responsive full-screen conversation. It has a sidebar of real account conversations on desktop, mobile history drawer, top model dropdown, one scrollable message region and a bottom composer. No dashboard cards or bottom tabs on chat.
Existing tiny.db chats, project memory, image upload, stream, provider picker and security connections are reused. Assistant responses render Markdown via react-markdown/remark-gfm. Other routes retain the existing AppHeader.
iPhone viewport uses existing visualViewport resize + offset vars. No global fetch wrapper, no fake data, no new backend. Tiniest Cloud draft only until explicit publish.

Mobile payload: model/settings/project routes and Markdown renderer are lazy-loaded; only chat shell and SDK load on fresh chat. Avoids eager rendering work on iPhone.

## V17 model UI design
No isolated model room or duplicated model card grid. Header dropdown and /directory use ModelCatalog, with real on-demand provider lists, source filters, shared cloud-saved favorite models (tiny.db model-fav:*), verified model choice, API-key setup and honest unconnected labels. Header has a short model label and quick-add + button. Background and header on every route share one flat light theme, with dark opt-in. No site-wide mobile bottom nav. Draft only.
