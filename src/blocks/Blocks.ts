import { z } from 'zod'
import { paragraphProps } from './Paragraph'
import { figureProps } from './Figure'

export const blockProps = z.union([paragraphProps, figureProps])

export type BlockProps = z.infer<typeof blockProps>

export const blockSequence = z.array(blockProps)

export type BlockSequence = z.infer<typeof blockSequence>
