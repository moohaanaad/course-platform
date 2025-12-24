

export function attachFiles(req) {
    if (!req.files) return;

    req.files.forEach(file => {
        const path = file.fieldname
            .replace(/\[(\d+)\]/g, '.$1') // convert [0] to .0
            .split('.');
    
        let pointer = req.body;

        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];

            if (pointer[key] === undefined) {

                if (!isNaN(path[i + 1])) {
                    pointer[key] = [];
                } else {
                    pointer[key] = {};
                }
            }

            pointer = pointer[key];
        }

        const lastKey = path[path.length - 1];

        if (Array.isArray(pointer[lastKey])) {
            pointer[lastKey].push(file.key);
        }
        else if (pointer[lastKey] !== undefined) {
            pointer[lastKey] = [pointer[lastKey], file.key];
        }
        else {
            pointer[lastKey] = file.key;
        }
    });
}
