# 01 — Ticket C：Awesome-CV 端的 deck skill 搬遷

**Status:** needs-triage

**What to build:** 在 Awesome-CV 端完成 `presentation-design`／`html-deck-design` 搬入 skill-dev 所需的前置工作，並在 skill-dev 出貨後移除本 repo 的副本與 symlink。Skill-dev 端的對應票：#2542（spec）、M1 #2543、M2 #2544、M3 #2545、M4 #2546、#2540。

**Blocked by:**

- ADR 0047（skill-dev PR #2541）合併，才能引用其 supersession（item 1）。
- skill-dev #2540（`_shared` 路徑）解決，才能處理 item 4 的 `_shared` 部分。
- skill-dev M2 #2544 的 schema-owner 決定，影響 item 2 的 profile contract 形狀。
- skill-dev M4 #2546 出貨，才能執行 item 4 的刪除與 symlink 移除。

## 項目

- [ ] **1. Supersede `spec/html-deck-skills.md` Decision 8。** L17 的「Awesome-CV only… skill-dev repo untouched」改為「由 skill-dev ADR 0047 取代」並連結 ADR。此編輯屬於執行本票時的工作，**不在新增本票的 PR 內**。
- [ ] **2. Domain profile（對應 skill-dev M1 #2543）。** 由 Awesome-CV 提供 Domain-owned profile，內含：
  - SAR 三色 token：`SAR-situation` `--alert` `#FF4545`、`SAR-action` `--primary` `#006FFF`、`SAR-result` `--success` `#00C853`（現位於 `html-deck-design/SKILL.md:52–54`，另 `:44` 為 SAR 卡片文法）。
  - Awesome-CV 預設值：`html-deck-design/SKILL.md:10,12` 的「Awesome-CV reference values」與 template token 區（`references/template.html` L9–24 所列）。
  - `Example SAR slide` template 內容（`references/template.html:227`）。
  - `render-deck.py:290` 的 regex 改由 neutral marker 取代，profile 提供對應資料。
  - 驗收：profile 足以讓 Awesome-CV 面試 deck 重建，且 `html-deck-design` 在無 Domain profile 時只處理中性輸入。
- [ ] **3. 引用更新。** `interview-presentation`、`tailor-resume`、`sar-extraction` 以 skill 名稱運作；移除任何假設 skill 位於 `Awesome-CV/.claude/skills` 的路徑。
  - 2026-11-02 檢查：這三份 `SKILL.md` 以 `.claude/skills` 與 `Awesome-CV/` 搜尋無命中；執行時需再對 `scripts/`、`fragments/` 與 `references/` 重新搜尋確認。
  - 修正 skill-dev M1 的描述：實測 `html-deck-design/SKILL.md:146` 引用 `interview-presentation`；`:3` 與 `:61`、`:145` 引用的是 `presentation-design`。M1 寫「L3,146 不得引用 interview-presentation」，對 L3 不精確，M1 執行時應依實測行號修正。
- [ ] **4. 出貨後清理（依賴 skill-dev M4 #2546）。**
  - 刪除 `.claude/skills/presentation-design/` 與 `.claude/skills/html-deck-design/`。
  - 移除 `~/.claude/skills/presentation-design` 與 `~/.claude/skills/html-deck-design` 兩個 symlink（2026-11-02 確認兩者皆指向本 repo 的 `.claude/skills/`）。
  - 用 profile 重建一份面試 deck，並通過 `verify-deck.py`。
  - 依 #2540 解決 `_shared` 路徑：`~/.claude/skills/_shared` 目前指向本 repo 的 `.claude/skills/_shared`；引用它的檔案為 `host-work-journal/SKILL.md`（L107、211、276、303、314、346、354）、`host-work-journal/scripts/collect-weekly-report.py:110`，以及 `_shared/milestone-schema.md`。在 #2540 決定前不得改寫此 symlink。
- [ ] **5. 通用規則去重：僅記錄依賴。** `presentation-design` Rules 1、2、3、5、6 的去重與 Rule 8（`zh-Hant`）移除由 skill-dev M3 #2545 處理，本票不執行。

## 驗收

1. `spec/html-deck-skills.md` Decision 8 已標示為由 ADR 0047 取代，且 ADR 已合併。
2. Awesome-CV 的 Domain profile 存在，且 SAR 色、預設值、example slide 不再位於 Medium skill 內。
3. `interview-presentation`、`tailor-resume`、`sar-extraction` 不含 `Awesome-CV/.claude/skills` 路徑假設。
4. 在 skill-dev 出貨後：Awesome-CV 不再含兩個 skill 目錄；`~/.claude/skills` 不再有指向本 repo 這兩者的 symlink；面試 deck 由 profile 重建並通過 `verify-deck.py`（以實際 exit code 為準）。
5. `_shared` 路徑處置依 #2540 的結論執行；未決前不改動。

## 備註

- 本票與 skill-dev 端的 tracker 關係為跨 repo，依 `docs/agents/issue-tracker.md` 記錄於本地 `.scratch/`；skill-dev 端以其 issue 編號為準。
- 本次新增本票的 PR 只包含 `.scratch/deck-skill-move/` 下的檔案，不含任何 skill、spec 或 profile 變更。
