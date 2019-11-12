
class CanvasRenderer {
	
	constructor(w, h) {
		const canvas = document.createElement("canvas");
		this.w = canvas.width = w;
		this.h = canvas.height = h;
		this.view = canvas;
		this.ctx = canvas.getContext("2d");
		this.ctx.textBaseline = "top";
	}
	
	render(container, clear = true) {
		const {ctx} = this;
		
		// RENDER RECURSIVE internal function.
		
		function renderRec(container) {
			container.children.forEach(child => {
				
				// (0) Check if visible.
				if (child.visible == false) {
					return;
				}
				
				// (1) Draw child.
				ctx.save();
				if (child.pos) {
					ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
				}
				// TEXT.
				if (child.text) {
					const {font, fill, align} = child.style;
					if (font) ctx.font = font;
					if (fill) ctx.fillStyle = fill;
					if (align) ctx.textAlign = align;
					ctx.fillText(child.text, 0, 0);
				}
				// TEXTURE.
				else if (child.texture) {
					ctx.drawImage(child.texture.img, 0, 0);
				}
				
				// (2) Apply renderRec if child has children.
				if (child.children) {
					renderRec(child);
				}
				ctx.restore();
				
			});
		}
		
		if (clear) {
			ctx.clearRect(0, 0, this.w, this.h);
		}
		
		// Start render recursive over all children in container.
		renderRec(container);
	}
}

export default CanvasRenderer;
