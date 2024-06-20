

export module Pathfinder {

    const DIRECTIONS: Point[] = [ { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 } ];

    /**
     * Starting from the given position, collects the set of all tiles that are reachable within the given
     * maximum cost. The provided cost function is used to evaluate which tiles are movable or not
     */
    export function findAll(start: Point, maxCost: number, costFunction: (pos: Point) => number): Set<Point> {

        // todo: this is horrific. The set is not actually a set (because points are bad)
        // I want to include a library to make this work properly, and I will do later
        // Refer to : https://immutable-js.com/docs/v4.3.6/ValueObject/
        // then `Point` becomes a class
        // and this becomes an `Immutable.Set`
        // later
        const seen: Set<Point> = new Set();
        const queue: [Point, number][] = [[start, 0]];

        while (queue.length > 0) {
            const [pos, cost] = queue.pop()!;

            seen.add(pos);

            for (const adj of DIRECTIONS) {
                const next = { x: pos.x + adj.x, y: pos.y + adj.y } as const;
                const nextCost = cost + costFunction(next);
                
                if (nextCost < maxCost) {
                    queue.push([next, nextCost]);
                }
            }
        }

        return seen;
    } 
}