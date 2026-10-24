# Timeline Order Game

Game where the student orders events chronologically. The student taps the events in the order they think is correct and then checks the answer.

## Files

| File | Description |
| --- | --- |
| `timeline-order-game.model.ts` | Types (`TimelineEvent`, `TimelineOrderGameData`, `TimelineOrderInteractiveContent`) and `toTimelineOrderGameModel`. |
| `timeline-order-game.module.ts` | `NgModule` that imports and re-exports the standalone component. |
| `timeline-order-game.component.ts` | Game component (`lib-timeline-order-game`). |
| `timeline-order-game.component.spec.ts` | Component unit tests. |

## Usage

Standalone component:

```ts
import { TimelineOrderGameComponent } from './timeline-order-game.component';
```

NgModule:

```ts
import { TimelineOrderGameModule } from './timeline-order-game.module';
```

Component inputs: `content` (required) and `disabled`. Output: `answerSubmitted`, emitted only when the order is correct.

## Order validation

An answer is correct only if the student placed **all** events and they are in ascending `order`. `order` values may be contiguous (1, 2, 3) or not (e.g. years).

- Correct order: success feedback and the result is emitted with score 100.
- Wrong or incomplete order: error feedback and the timeline resets after 2 s.
- While `disabled` is set, events cannot be selected or checked.

## Changes

- Types moved from `.module.ts` to `.model.ts`, like the other games, and exported from `index.ts`.
- `.module.ts` is now a real `NgModule`.
- Fixed `checkAnswer()`: an empty list returned success and `order` was assumed to be contiguous.
- Added 16 tests (rendering, selection and validation).

## Tests

```bash
npx nx test game-engine/core
```