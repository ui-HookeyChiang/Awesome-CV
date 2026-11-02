# Deck skill move — Awesome-CV 端

## 背景

- skill-dev 的 ADR 0047（`docs/adr/0047-information-presentation-layers.md`，PR ui-HookeyChiang/skill-dev#2541，狀態 accepted，**尚未合併**）決定將 `presentation-design` 與 `html-deck-design` 成對搬入 skill-dev，前提是先完成解耦 (a)–(e)。
- 本 repo 的 `spec/html-deck-skills.md` Decision 8（L17）寫明「Awesome-CV only… skill-dev repo untouched」。此決定由 ADR 0047 取代。
- Skill-dev 端追蹤：spec #2542；M1 #2543（Domain 解耦，Awesome-CV 先做，即本票 item 2）；M2 #2544（schema/renderer cycle，blocked by schema-owner 決定）；M3 #2545（Content 規則清理，depends on #2538）；M4 #2546（搬遷，blocked by M1–M3 與 #2540）；#2540（`~/.claude/skills/_shared` 路徑衝突）。

## 本 repo 的角色

Awesome-CV 保留 `Domain` 層的三個 skill：`interview-presentation`、`tailor-resume`、`sar-extraction`。它們提供 SAR profile 與 case 資料，並依賴 skill-dev 版的 `presentation-design`（Content）與 `html-deck-design`（Medium）。

本 PRD 只描述 Awesome-CV 端的工作，細節見 `issues/01-awesome-cv-side.md`（Ticket C）。

## 範圍

1. 以 ADR 0047 取代 `spec/html-deck-skills.md` Decision 8 的 landing 決定（spec 編輯本身屬於 Ticket C，不在新增 ticket 的 PR 內執行）。
2. Domain profile：SAR 三色 token、Awesome-CV 預設值、`Example SAR slide` template 內容，移出 Medium skill，改由 Awesome-CV 的 Domain profile 提供。
3. `interview-presentation`、`tailor-resume`、`sar-extraction` 維持以 skill 名稱運作；更新假設 skill 位於 `Awesome-CV/.claude/skills` 的引用。
4. skill-dev 出貨後，刪除 Awesome-CV 的兩個 skill 目錄與 `~/.claude/skills` symlink；從 profile 重建一份面試 deck 並通過 `verify-deck.py`；依 #2540 解決 `_shared` 路徑。
5. 通用規則去重（Rules 1、2、3、5、6）屬於 skill-dev M3，本 repo 只記錄依賴。

## 非目標

- 不改 deck 的視覺設計或 token 值。
- 不將 Domain 三個 skill 搬離 Awesome-CV。
- 不在本 PR 修改 `~/.claude/skills/_shared`（待 #2540）。
- 不修改 skill-dev repo。

## 依賴圖

```
skill-dev ADR 0047 (#2541) ──merge──▶ spec/html-deck-skills.md Decision 8 supersession
skill-dev #2542 spec
  ├─ M1 #2543 ◀── Ticket C item 2（Awesome-CV profile）
  ├─ M2 #2544 ◀── schema-owner 決定（Owner，未決）
  ├─ M3 #2545 ◀── #2538（Principles reference）
  └─ #2540（_shared 路徑）
M4 #2546（搬遷）──出貨後──▶ Ticket C item 4（刪除 Awesome-CV 副本與 symlink）
```

## 已知風險

- [可能風險] ADR 0047 尚未合併；在合併前引用其 supersession 會指向未落地的決定。
- [可能風險] M2 的 schema-owner 問題未決；若採替代方案，Ticket C item 2 的 profile contract 可能需要改寫。
- [不知道] 本 repo 的 `make check` 是 resume 頁數檢查（需 xelatex 建置），不是 docs 檢查；本 repo 目前沒有文件專用的 fast check。
