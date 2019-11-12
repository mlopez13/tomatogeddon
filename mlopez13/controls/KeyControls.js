
class KeyControls {
	
	constructor() {
		
		// List of keys that are pressed.
		this.keys = {};
		
		// KEYDOWN.
		document.addEventListener("keydown", e => {
			
			// To prevent scrolling if arrow keys are pressed.
			if ([37, 38, 39, 40].indexOf(e.which) >= 0) {
				e.preventDefault();
			}
			
			// If key e.which is pressed, turn keys[e.which] into true.
			this.keys[e.which] = true;
			
		}, false);
		
		// KEYUP.
		document.addEventListener("keyup", e => {
			
			// If key e.which is no longer pressed, turn keys[e.which] into false.
			this.keys[e.which] = false;
			
		}, false);
		
	}
	
	// KEY ACTIONS.
	
	// Spacebar.
	get action() {
		return this.keys[32];
	}
	
	get x() {
		// Left arrow or A.
		if (this.keys[37] || this.keys[65]) {
			return -1;
		}
		// Right arrow or D.
		if (this.keys[39] || this.keys[68]) {
			return 1;
		}
		return 0;
	}
	
	get y() {
		// Up arrow or W.
		if (this.keys[38] || this.keys[87]) {
			return -1;
		}
		// Down arrow or S.
		if (this.keys[40] || this.keys[83]) {
			return 1;
		}
		return 0;
	}
}

export default KeyControls;
