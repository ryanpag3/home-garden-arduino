export const shortSinceToSeconds = input => {
    if (input.includes('s')) {
        const s = input.slice(0, -1);
        return Number.parseInt(s);
    }

    var p = input
           .replace('h', 'x3600')
           .replace('d', 'x86400')
           .replace('w', 'x604800')
           .replace('m', 'x2.628e+6')
           .replace('y', 'x3.154e+7').split('x')
    return (p[0] || 0) * (p[1] || 0)
}
  