import { ReactElement, useCallback, useRef } from 'react'
import { z } from 'zod'
import { Button as FluentButton } from '@fluentui/react-components'
import { Icon, iconSize, iconVariant } from '../../inlines'
import {
  propsElementUnion2,
  emit,
  actionPayload,
  withActionHandler,
} from '../../lib'

const buttonActivateAction = actionPayload.merge(
  z.object({
    type: z.literal('activate'),
  })
)
export type ButtonActivateAction = z.infer<typeof buttonActivateAction>

export const buttonProps = z.object({
  // buttons can't be 'required', so that property is excluded
  type: z.literal('button'),
  label: z.string().min(1), // this is intentionally not `inlineSequence` and it must not be an empty string
  actionId: z.string(),
  variant: z
    .union([
      z.literal('outline'),
      z.literal('primary'),
      z.literal('subtle'),
      z.literal('transparent'),
    ])
    .optional(),
  iconOnly: z.boolean().optional(),
  icon: z.string().optional(),
  iconPosition: z.union([z.literal('before'), z.literal('after')]).optional(),
  iconSize: iconSize.optional(),
  iconVariant: iconVariant.optional(),
  ...withActionHandler(buttonActivateAction),
})
export type ButtonProps = z.infer<typeof buttonProps>

export const Button = ({
  label,
  iconOnly,
  icon,
  iconPosition,
  variant,
  iconSize,
  iconVariant,
  actionId,
  onAction,
}: ButtonProps) => {
  const $el = useRef<HTMLButtonElement | null>(null)

  const onButtonActivate = useCallback(() => {
    onAction && onAction({ type: 'activate', actionId })
    $el.current &&
      emit<HTMLButtonElement, ButtonActivateAction>($el.current, {
        type: 'activate',
        actionId,
      })
  }, [onAction])

  return (
    <FluentButton
      block
      aria-label={label}
      appearance={variant}
      {...{ iconOnly, iconPosition }}
      {...(icon && {
        icon: (
          <Icon
            icon={icon}
            size={iconSize || 24}
            variant={iconVariant || 'outline'}
          />
        ),
      })}
      onClick={onButtonActivate}
      ref={$el}
    >
      {iconOnly ? null : label}
    </FluentButton>
  )
}

function isButtonProps(o: any): o is ButtonProps {
  return o && 'type' in o && o.type === 'button'
}

function isButtonElement(
  o: any
): o is ReactElement<ButtonProps, typeof Button> {
  return o?.type === Button
}

export const buttonPropsOrElement = propsElementUnion2<
  typeof buttonProps,
  typeof Button
>(buttonProps)
export type ButtonPropsOrElement = z.infer<typeof buttonPropsOrElement>

export function renderIfButton(o: any) {
  return isButtonProps(o) ? <Button {...o} /> : isButtonElement(o) ? o : null
}
