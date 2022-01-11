// eslint-disable-next-line max-classes-per-file
import { Theme } from '../../lib'
import {
  IChartPatterns,
  ILineChartPatterns,
  EPointStyles,
  EShapes,
} from './chart-types'

const BACKGROUND_COLOR = 'transparent'
const PATTERN_COLOR = 'rgba(0, 0, 0, 0.8)'
const POINT_STYLE = 'round'
const SIZE = 20

export const lineChartPatterns: ILineChartPatterns[] = [
  { lineBorderDash: [], pointStyle: EPointStyles.Circle },
  { lineBorderDash: [], pointStyle: EPointStyles.Rectangle },
  { lineBorderDash: [], pointStyle: EPointStyles.Triangle },
  { lineBorderDash: [5, 5], pointStyle: EPointStyles.Circle },
  { lineBorderDash: [5, 5], pointStyle: EPointStyles.RectangleRotated },
  { lineBorderDash: [5, 5], pointStyle: EPointStyles.Triangle },
]

export const legendLabels = ({
  canvasRef,
  theme,
  colorScheme,
  dataPointColor,
  index,
  patterns,
}: {
  canvasRef: HTMLCanvasElement
  theme: Theme
  colorScheme: any
  dataPointColor: string
  index: number
  patterns?: IChartPatterns
}) => {
  if (!canvasRef) {return}
  const ctx: any = canvasRef.getContext('2d')
  ctx.save()
  if (!ctx) {return}
  if (theme === 'high-contrast') {
    if (patterns) {
      ctx.setTransform(1.4, 0, 0, 1, 0, 0)
      ctx.scale(12, 10)
      ;(ctx.fillStyle as any) = buildPattern({
        ...patterns(colorScheme)[index],
        backgroundColor: colorScheme.default.background,
        patternColor: colorScheme.brand.background,
      })
      ctx.fillRect(-15, -15, canvasRef.width, canvasRef.height)
      ctx.restore()
    } else {
      ctx.scale(15, 15)
      ctx.fillStyle = colorScheme.brand.shadow
      ctx.fillRect(-15, -15, canvasRef.width, canvasRef.height)
      ctx.fillStyle = colorScheme.default.foreground3
      switch (lineChartPatterns[index].pointStyle) {
        case EPointStyles.Triangle:
          ctx.moveTo(9.5, 2.5)
          ctx.lineTo(5.5, 7.5)
          ctx.lineTo(13.5, 7.5)
          break
        case EPointStyles.Rectangle:
          ctx.rect(6.5, 2.5, 8, 5)
          break
        case EPointStyles.RectangleRotated:
          ctx.moveTo(10, 2)
          ctx.lineTo(14.5, 5)
          ctx.lineTo(10, 8)
          ctx.lineTo(5.5, 5)
          break
        case EPointStyles.Circle:
        default:
          ctx.ellipse(10, 5, 3.5, 2.5, 0, 0, 2 * Math.PI)
          break
      }
      ctx.fill()

      // Line Style
      ctx.strokeStyle = colorScheme.default.foreground3
      ctx.beginPath()
      ctx.setLineDash(
        lineChartPatterns[index].lineBorderDash.length ? [2, 2] : []
      )
      ctx.moveTo(-1.5, 5)
      ctx.lineTo(20, 5)
      ctx.stroke()
      ctx.restore()
    }
  } else {
    ctx.fillStyle = dataPointColor
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height)
  }
}

export const chartLineStackedDataPointPatterns: IChartPatterns = (
  colorScheme: any
) => [
    {
      shapeType: EShapes.Square,
      size: 10,
    },
    {
      shapeType: EShapes.DiagonalRightLeft,
      size: 5,
    },
    {
      shapeType: EShapes.Grid,
      size: 10,
    },
    {
      shapeType: EShapes.VerticalLine,
      size: 10,
    },
    {
      shapeType: EShapes.GridRightLeft,
      size: 3,
    },
    {
      shapeType: EShapes.Diagonal,
      size: 5,
    },
  ]

export const chartBarDataPointPatterns: IChartPatterns = (colorScheme: any) => [
    {
      shapeType: EShapes.DiagonalRightLeft,
      size: 5,
    },
    {
      shapeType: EShapes.Square,
      size: 10,
    },
    {
      shapeType: EShapes.Diagonal,
      size: 5,
    },
    {
      shapeType: EShapes.Grid,
      size: 10,
    },
    {
      shapeType: EShapes.GridRightLeft,
      size: 3,
    },
    {
      shapeType: EShapes.VerticalLine,
      size: 7,
    },
  ]

export const chartBubbleDataPointPatterns: IChartPatterns = (
  colorScheme: any
) => [
    {
      shapeType: EShapes.DiagonalRightLeft,
      size: 5,
    },
    {
      shapeType: EShapes.Square,
      size: 10,
    },
    {
      shapeType: EShapes.Diagonal,
      size: 5,
    },
    {
      shapeType: EShapes.Grid,
      size: 10,
    },
    {
      shapeType: EShapes.GridRightLeft,
      size: 3,
    },
    {
      shapeType: EShapes.VerticalLine,
      size: 7,
    },
  ]

export class Entity {
  public constructor(fields?: any) {
    Object.assign(this, fields)
  }
}

export class Shape extends Entity {
  public canvas?: HTMLCanvasElement
  public context?: CanvasRenderingContext2D | null
  public size = SIZE
  public backgroundColor: string = BACKGROUND_COLOR
  public patternColor: string = PATTERN_COLOR

  constructor(fields: Partial<Shape>) {
    super(fields)

    if (fields.size) {
      this.size = fields.size
    }
    if (fields.backgroundColor) {
      this.backgroundColor = fields.backgroundColor
    }
    if (fields.patternColor) {
      this.patternColor = fields.patternColor
    }

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.width = this.size
    this.canvas.height = this.size

    if (this.context) {
      this.context.fillStyle = this.backgroundColor
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  public setStrokeProps() {
    if (this.context) {
      this.context.strokeStyle = this.patternColor
      this.context.lineWidth = this.size / 10
      this.context.lineJoin = POINT_STYLE
      this.context.lineCap = POINT_STYLE
    }
  }

  public setFillProps() {
    if (this.context) {
      this.context.fillStyle = this.patternColor
    }
  }
}

class Square extends Shape {
  public drawTile() {
    const halfSize = this.size / 2
    if (this.context) {
      this.context.beginPath()
      this.setFillProps()
      this.drawSquare()
      this.drawSquare(halfSize, halfSize)
      this.context.fill()
    }
    return this.canvas
  }

  public drawSquare(offsetX = 0, offsetY = 0) {
    const halfSize = this.size / 2
    const gap = this.size / 5
    this.context!.fillRect(
      offsetX + gap,
      offsetY + gap,
      halfSize - gap * 2,
      halfSize - gap * 2
    )
    this.context!.closePath()
  }
}

class Diagonal extends Shape {
  public drawTile() {
    const halfSize = this.size / 2

    if (this.context) {
      this.context.beginPath()

      this.setStrokeProps()

      this.drawDiagonalLine()
      this.drawDiagonalLine(halfSize, halfSize)

      this.context.stroke()
      return this.canvas
    }
  }

  public drawDiagonalLine(offsetX = 0, offsetY = 0) {
    const size = this.size
    const halfSize = size / 2
    const gap = 1

    if (this.context) {
      this.context.moveTo(halfSize - gap - offsetX, gap * -1 + offsetY)
      this.context.lineTo(size + 1 - offsetX, halfSize + 1 + offsetY)

      this.context.closePath()
    }
  }
}

class DiagonalRightLeft extends Diagonal {
  public drawTile() {
    if (this.context) {
      this.context.translate(this.size, 0)
      this.context.rotate((90 * Math.PI) / 180)

      Diagonal.prototype.drawTile.call(this)

      return this.canvas
    }
  }
}

class Grid extends Shape {
  public drawTile() {
    const halfSize = this.size / 2

    if (this.context) {
      this.context.beginPath()

      this.setStrokeProps()

      // this.drawDiagonalLine();
      // this.drawDiagonalLine(halfSize, halfSize);

      this.drawOpositeDiagonalLine()
      this.drawOpositeDiagonalLine(halfSize, halfSize)

      this.context.stroke()
    }

    return this.canvas
  }

  public drawDiagonalLine(offsetX = 0, offsetY = 0) {
    const size = this.size
    const halfSize = size / 2
    const gap = 1

    if (this.context) {
      this.context.moveTo(halfSize - gap - offsetX, gap * -1 + offsetY)
      this.context.lineTo(size + 1 - offsetX, halfSize + 1 + offsetY)

      this.context.closePath()
    }
  }

  public drawOpositeDiagonalLine(offsetX = 0, offsetY = 0) {
    const size = this.size
    const halfSize = size / 2
    const gap = 1

    if (this.context) {
      this.context.moveTo(halfSize - gap + offsetX, gap * -1 - offsetY)
      this.context.lineTo(size + 1 + offsetX, halfSize + 1 - offsetY)

      this.context.closePath()
    }
  }
}

class Line extends Shape {
  public drawTile() {
    if (this.context) {
      const halfSize = this.size / 2

      this.context.beginPath()

      this.setStrokeProps()

      this.drawLine()
      this.drawLine(halfSize, halfSize)

      this.context.stroke()

      return this.canvas
    }
  }

  public drawLine(offsetX = 0, offsetY = 0) {
    if (this.context) {
      const size = this.size
      const quarterSize = size / 4

      this.context.moveTo(0, quarterSize + offsetY)
      this.context.lineTo(this.size, quarterSize + offsetY)

      this.context.closePath()
    }
  }
}

class VerticalLine extends Line {
  public drawTile() {
    if (this.context) {
      this.context.translate(this.size, 0)
      this.context.rotate((90 * Math.PI) / 180)

      Line.prototype.drawTile.call(this)

      return this.canvas
    }
  }
}

class GridRightLeft extends Grid {
  public drawTile() {
    if (this.context) {
      this.context.translate(this.size, 0)
      this.context.rotate((90 * Math.PI) / 180)

      Grid.prototype.drawTile.call(this)

      return this.canvas
    }
  }
}

const shapes = {
  [EShapes.Square]: Square,
  [EShapes.DiagonalRightLeft]: DiagonalRightLeft,
  [EShapes.Grid]: Grid,
  [EShapes.Diagonal]: Diagonal,
  [EShapes.VerticalLine]: VerticalLine,
  [EShapes.GridRightLeft]: GridRightLeft,
}

export function buildPattern({
  shapeType,
  backgroundColor,
  patternColor,
  size,
}: {
  shapeType: EShapes
  size: number
  backgroundColor: string
  patternColor: string
}) {
  const patternCanvas = document.createElement('canvas')
  const patternContext = patternCanvas.getContext('2d')
  const outerSize = size * 2

  const Shape = shapes[shapeType]
  const shape = new Shape({ size, backgroundColor, patternColor })

  const pattern: CanvasPattern | null = patternContext!.createPattern(
    shape.drawTile()!,
    'repeat'
  )

  patternCanvas.width = outerSize
  patternCanvas.height = outerSize

  if (pattern) {
    ;(pattern as any).shapeType = shapeType
  }

  return pattern
}
