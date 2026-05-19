/**
 * ShapeGrid - A premium, interactive, and animated background grid component.
 * Ports React-Bits ShapeGrid to Vanilla HTML5 Canvas.
 */
class ShapeGrid {
    constructor(canvas, options = {}) {
        if (!canvas) {
            console.error('ShapeGrid: Canvas element is required.');
            return;
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Configurable options
        this.direction = options.direction || 'right';
        this.speed = options.speed !== undefined ? options.speed : 1;
        this.borderColor = options.borderColor || '#999';
        this.squareSize = options.squareSize || 40;
        this.hoverFillColor = options.hoverFillColor || '#222';
        this.shape = options.shape || 'square';
        this.hoverTrailAmount = options.hoverTrailAmount !== undefined ? options.hoverTrailAmount : 0;

        // Constants for shapes
        this.isHex = this.shape === 'hexagon';
        this.isTri = this.shape === 'triangle';
        this.hexHoriz = this.squareSize * 1.5;
        this.hexVert = this.squareSize * Math.sqrt(3);

        // Grid offsets and animation states
        this.gridOffset = { x: 0, y: 0 };
        this.hoveredSquare = null;
        this.trailCells = [];
        this.cellOpacities = new Map();
        this.animationFrameId = null;

        // Bind events
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.updateAnimation = this.updateAnimation.bind(this);

        this.init();
    }

    init() {
        // Event Listeners
        window.addEventListener('resize', this.resizeCanvas);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave);

        // Initial setup
        this.resizeCanvas();

        // Start animation loop
        this.animationFrameId = requestAnimationFrame(this.updateAnimation);
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    destroy() {
        window.removeEventListener('resize', this.resizeCanvas);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    drawHex(cx, cy, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const vx = cx + size * Math.cos(angle);
            const vy = cy + size * Math.sin(angle);
            if (i === 0) this.ctx.moveTo(vx, vy);
            else this.ctx.lineTo(vx, vy);
        }
        this.ctx.closePath();
    }

    drawCircle(cx, cy, size) {
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
        this.ctx.closePath();
    }

    drawTriangle(cx, cy, size, flip) {
        this.ctx.beginPath();
        if (flip) {
            this.ctx.moveTo(cx, cy + size / 2);
            this.ctx.lineTo(cx + size / 2, cy - size / 2);
            this.ctx.lineTo(cx - size / 2, cy - size / 2);
        } else {
            this.ctx.moveTo(cx, cy - size / 2);
            this.ctx.lineTo(cx + size / 2, cy + size / 2);
            this.ctx.lineTo(cx - size / 2, cy + size / 2);
        }
        this.ctx.closePath();
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.isHex) {
            const colShift = Math.floor(this.gridOffset.x / this.hexHoriz);
            const offsetX = ((this.gridOffset.x % this.hexHoriz) + this.hexHoriz) % this.hexHoriz;
            const offsetY = ((this.gridOffset.y % this.hexVert) + this.hexVert) % this.hexVert;

            const cols = Math.ceil(this.canvas.width / this.hexHoriz) + 3;
            const rows = Math.ceil(this.canvas.height / this.hexVert) + 3;

            for (let col = -2; col < cols; col++) {
                for (let row = -2; row < rows; row++) {
                    const cx = col * this.hexHoriz + offsetX;
                    const cy = row * this.hexVert + ((col + colShift) % 2 !== 0 ? this.hexVert / 2 : 0) + offsetY;

                    const cellKey = `${col},${row}`;
                    const alpha = this.cellOpacities.get(cellKey);
                    if (alpha) {
                        this.ctx.globalAlpha = alpha;
                        this.drawHex(cx, cy, this.squareSize);
                        this.ctx.fillStyle = this.hoverFillColor;
                        this.ctx.fill();
                        this.ctx.globalAlpha = 1;
                    }

                    this.drawHex(cx, cy, this.squareSize);
                    this.ctx.strokeStyle = this.borderColor;
                    this.ctx.stroke();
                }
            }
        } else if (this.isTri) {
            const halfW = this.squareSize / 2;
            const colShift = Math.floor(this.gridOffset.x / halfW);
            const rowShift = Math.floor(this.gridOffset.y / this.squareSize);
            const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
            const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

            const cols = Math.ceil(this.canvas.width / halfW) + 4;
            const rows = Math.ceil(this.canvas.height / this.squareSize) + 4;

            for (let col = -2; col < cols; col++) {
                for (let row = -2; row < rows; row++) {
                    const cx = col * halfW + offsetX;
                    const cy = row * this.squareSize + this.squareSize / 2 + offsetY;
                    const flip = ((col + colShift + row + rowShift) % 2 + 2) % 2 !== 0;

                    const cellKey = `${col},${row}`;
                    const alpha = this.cellOpacities.get(cellKey);
                    if (alpha) {
                        this.ctx.globalAlpha = alpha;
                        this.drawTriangle(cx, cy, this.squareSize, flip);
                        this.ctx.fillStyle = this.hoverFillColor;
                        this.ctx.fill();
                        this.ctx.globalAlpha = 1;
                    }

                    this.drawTriangle(cx, cy, this.squareSize, flip);
                    this.ctx.strokeStyle = this.borderColor;
                    this.ctx.stroke();
                }
            }
        } else if (this.shape === 'circle') {
            const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
            const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

            const cols = Math.ceil(this.canvas.width / this.squareSize) + 3;
            const rows = Math.ceil(this.canvas.height / this.squareSize) + 3;

            for (let col = -2; col < cols; col++) {
                for (let row = -2; row < rows; row++) {
                    const cx = col * this.squareSize + this.squareSize / 2 + offsetX;
                    const cy = row * this.squareSize + this.squareSize / 2 + offsetY;

                    const cellKey = `${col},${row}`;
                    const alpha = this.cellOpacities.get(cellKey);
                    if (alpha) {
                        this.ctx.globalAlpha = alpha;
                        this.drawCircle(cx, cy, this.squareSize);
                        this.ctx.fillStyle = this.hoverFillColor;
                        this.ctx.fill();
                        this.ctx.globalAlpha = 1;
                    }

                    this.drawCircle(cx, cy, this.squareSize);
                    this.ctx.strokeStyle = this.borderColor;
                    this.ctx.stroke();
                }
            }
        } else {
            // Default: Square
            const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
            const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

            const cols = Math.ceil(this.canvas.width / this.squareSize) + 3;
            const rows = Math.ceil(this.canvas.height / this.squareSize) + 3;

            for (let col = -2; col < cols; col++) {
                for (let row = -2; row < rows; row++) {
                    const sx = col * this.squareSize + offsetX;
                    const sy = row * this.squareSize + offsetY;

                    const cellKey = `${col},${row}`;
                    const alpha = this.cellOpacities.get(cellKey);
                    if (alpha) {
                        this.ctx.globalAlpha = alpha;
                        this.ctx.fillStyle = this.hoverFillColor;
                        this.ctx.fillRect(sx, sy, this.squareSize, this.squareSize);
                        this.ctx.globalAlpha = 1;
                    }

                    this.ctx.strokeStyle = this.borderColor;
                    this.ctx.strokeRect(sx, sy, this.squareSize, this.squareSize);
                }
            }
        }

        // Add a premium subtle radial gradient vignette
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2,
            this.canvas.height / 2,
            0,
            this.canvas.width / 2,
            this.canvas.height / 2,
            Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2) / 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.45)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateAnimation() {
        const effectiveSpeed = Math.max(this.speed, 0.05);
        const wrapX = this.isHex ? this.hexHoriz * 2 : this.squareSize;
        const wrapY = this.isHex ? this.hexVert : this.isTri ? this.squareSize * 2 : this.squareSize;

        switch (this.direction) {
            case 'right':
                this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
                break;
            case 'left':
                this.gridOffset.x = (this.gridOffset.x + effectiveSpeed + wrapX) % wrapX;
                break;
            case 'up':
                this.gridOffset.y = (this.gridOffset.y + effectiveSpeed + wrapY) % wrapY;
                break;
            case 'down':
                this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
                break;
            case 'diagonal':
                this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
                this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
                break;
            default:
                break;
        }

        this.updateCellOpacities();
        this.drawGrid();
        this.animationFrameId = requestAnimationFrame(this.updateAnimation);
    }

    updateCellOpacities() {
        const targets = new Map();

        if (this.hoveredSquare) {
            targets.set(`${this.hoveredSquare.x},${this.hoveredSquare.y}`, 1);
        }

        if (this.hoverTrailAmount > 0) {
            for (let i = 0; i < this.trailCells.length; i++) {
                const t = this.trailCells[i];
                const key = `${t.x},${t.y}`;
                if (!targets.has(key)) {
                    targets.set(key, (this.trailCells.length - i) / (this.trailCells.length + 1));
                }
            }
        }

        for (const [key] of targets) {
            if (!this.cellOpacities.has(key)) {
                this.cellOpacities.set(key, 0);
            }
        }

        for (const [key, opacity] of this.cellOpacities) {
            const target = targets.get(key) || 0;
            const next = opacity + (target - opacity) * 0.15;
            if (next < 0.005) {
                this.cellOpacities.delete(key);
            } else {
                this.cellOpacities.set(key, next);
            }
        }
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.isHex) {
            const colShift = Math.floor(this.gridOffset.x / this.hexHoriz);
            const offsetX = ((this.gridOffset.x % this.hexHoriz) + this.hexHoriz) % this.hexHoriz;
            const offsetY = ((this.gridOffset.y % this.hexVert) + this.hexVert) % this.hexVert;
            const adjustedX = mouseX - offsetX;
            const adjustedY = mouseY - offsetY;

            const col = Math.round(adjustedX / this.hexHoriz);
            const rowOffset = (col + colShift) % 2 !== 0 ? this.hexVert / 2 : 0;
            const row = Math.round((adjustedY - rowOffset) / this.hexVert);

            this.updateHoveredSquare(col, row);
        } else if (this.isTri) {
            const halfW = this.squareSize / 2;
            const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
            const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

            const adjustedX = mouseX - offsetX;
            const adjustedY = mouseY - offsetY;

            const col = Math.round(adjustedX / halfW);
            const row = Math.floor(adjustedY / this.squareSize);

            this.updateHoveredSquare(col, row);
        } else if (this.shape === 'circle') {
            const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
            const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

            const adjustedX = mouseX - offsetX;
            const adjustedY = mouseY - offsetY;

            const col = Math.round(adjustedX / this.squareSize);
            const row = Math.round(adjustedY / this.squareSize);

            this.updateHoveredSquare(col, row);
        } else {
            const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
            const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

            const adjustedX = mouseX - offsetX;
            const adjustedY = mouseY - offsetY;

            const col = Math.floor(adjustedX / this.squareSize);
            const row = Math.floor(adjustedY / this.squareSize);

            this.updateHoveredSquare(col, row);
        }
    }

    updateHoveredSquare(col, row) {
        if (!this.hoveredSquare || this.hoveredSquare.x !== col || this.hoveredSquare.y !== row) {
            if (this.hoveredSquare && this.hoverTrailAmount > 0) {
                this.trailCells.unshift({ ...this.hoveredSquare });
                if (this.trailCells.length > this.hoverTrailAmount) {
                    this.trailCells.length = this.hoverTrailAmount;
                }
            }
            this.hoveredSquare = { x: col, y: row };
        }
    }

    handleMouseLeave() {
        if (this.hoveredSquare && this.hoverTrailAmount > 0) {
            this.trailCells.unshift({ ...this.hoveredSquare });
            if (this.trailCells.length > this.hoverTrailAmount) {
                this.trailCells.length = this.hoverTrailAmount;
            }
        }
        this.hoveredSquare = null;
    }
}

// Make globally available
window.ShapeGrid = ShapeGrid;
