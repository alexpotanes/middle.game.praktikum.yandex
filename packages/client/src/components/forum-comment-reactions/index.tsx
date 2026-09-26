import type { ForumCommentReaction } from '../../api/types'
import { ErrorText } from '../form-field/styles'
import {
  ReactionButton,
  ReactionCount,
  ReactionsBar,
  ReactionsWrap,
} from './styles'

export const AVAILABLE_REACTIONS = ['👍', '❤️', '😂', '🎉', '🔥', '👀'] as const

type ForumCommentReactionsProps = {
  reactions: ForumCommentReaction[]
  onReact: (emoji: string) => void
  disabled?: boolean
  error?: string | null
}

export const ForumCommentReactions = ({
  reactions,
  onReact,
  disabled = false,
  error,
}: ForumCommentReactionsProps) => {
  const reactionsByEmoji = new Map(
    reactions.map(reaction => [reaction.emoji, reaction])
  )

  return (
    <ReactionsWrap>
      <ReactionsBar>
        {AVAILABLE_REACTIONS.map(emoji => {
          const reaction = reactionsByEmoji.get(emoji)
          const count = reaction?.count ?? 0
          const isActive = reaction?.reacted ?? false

          return (
            <ReactionButton
              key={emoji}
              type="button"
              onClick={() => onReact(emoji)}
              disabled={disabled}
              $active={isActive}
              aria-label={`Реакция ${emoji}`}
              aria-pressed={isActive}>
              <span aria-hidden>{emoji}</span>
              {count > 0 && <ReactionCount>{count}</ReactionCount>}
            </ReactionButton>
          )
        })}
      </ReactionsBar>
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </ReactionsWrap>
  )
}
