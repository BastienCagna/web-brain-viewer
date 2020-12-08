//src: https://gist.github.com/sketchpunk/f5fa58a56dcfe6168a9328e7c32a4fd4
function b64ToFloat32Array(blob): Float32Array {
    let fLen	= blob.length / Float32Array.BYTES_PER_ELEMENT;
    let dView= new DataView( new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT) );
    let fAry = new Float32Array(fLen);
    let p = 0;
    for (let j = 0; j < fLen; j++) {
        p = j * 4;
        dView.setUint8(0, blob.charCodeAt(p));
        dView.setUint8(1, blob.charCodeAt(p + 1));
        dView.setUint8(2, blob.charCodeAt(p + 2));
        dView.setUint8(3, blob.charCodeAt(p + 3));
        fAry[j] = dView.getFloat32(0, true);
    }
    return fAry;
}

function b64ToInt32Array(blob): Int32Array {
    let fLen = blob.length / Int32Array.BYTES_PER_ELEMENT;
    let dView= new DataView( new ArrayBuffer(Int32Array.BYTES_PER_ELEMENT) );
    let fAry = new Int32Array(fLen);
    let p = 0;
    for (let j = 0; j < fLen; j++) {
        p = j * 4;
        dView.setUint8(0, blob.charCodeAt(p));
        dView.setUint8(1, blob.charCodeAt(p + 1));
        dView.setUint8(2, blob.charCodeAt(p + 2));
        dView.setUint8(3, blob.charCodeAt(p + 3));
        fAry[j] = dView.getInt32(0, true);
    }
    return fAry;
}

export { b64ToFloat32Array, b64ToInt32Array };