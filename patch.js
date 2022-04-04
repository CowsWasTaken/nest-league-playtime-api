BigInt.prototype.toJSON = function() { return this.toString() } 
// JS is not able to serialize BigInts so this is a workaround for it
// https://github.com/prisma/studio/issues/614
