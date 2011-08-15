dojo.provide("boxgraph.routing.manhattan2");

dojo.declare("boxgraph.routing.manhattan2", null,
{
    boxmanager:     "",
    
    constructor: function(args)
    {
        this.boxmanager = args.boxmanager;    
    },
    
    // fp - firstport - beginning, sp - secondport - end
    getRouting: function(fp, sp)
    {        
        var nextpoint = { x: fp.x, y: fp.y };
        var rv = [nextpoint]; // Returns an array of {x:0, y:0} objects, beginning at fp
        
        while(nextpoint.x != sp.x && nextpoint.y != sp.y) // Loop until the next point _is_ our destination
        {
            var dir = this.getDirection(nextpoint, sp); // If sp.x > fp.x and fp is located 'up', then direction is left
            nextpoint = this.getNextPoint(dir, nextpoint, sp);
            rv.push(nextpoint);
        }
        rv.push(nextpoint); // And add that as well. We're home.
        return rv;
	},
    
    // The direction of a line. It is dependent on 1) The face of the box the first/beginning port is on and 2) on the +/- of the coord diff between fp & sp
    getDirection: function(fp, sp)
    {
        var dir = -1;
        switch(fp.where)
        {
            case "up":
            case "down":
                dir = sp.x > fp.x ? "left" : "right";  // If second port is to the left of first port, we go left, else right..
            break;
            case "right":            
            case "left":
                dir = sp.y > fp.y ? "down" : "up";
            break;
        }
        return dir;
    },
    
    // Uses the boxmanager to search for the next empty space for a given direction. E.g. a coordinate which is not inside a box in the line of directions.
    getNextPoint: function(dir, startpoint, sp)
    {
        var goodpoint = this.boxmanager.getGoodPointFor(dir, start, dest);
        return goodpoint;
    }
});
