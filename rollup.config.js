import typescript from 'rollup-plugin-typescript2';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/main.ts',
    output: [{
        name: 'Web-Brain-Viewer',
        file: 'dist/web-brain-viewer.js',
        format: 'es'
    }],

    plugins: [
        typescript(),
        //babel(),
        nodeResolve({
            // use "jsnext:main" if possible
            // see https://github.com/rollup/rollup/wiki/jsnext:main
            jsnext: true
        })
    ]
}

