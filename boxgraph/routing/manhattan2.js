dojo.provide("boxgraph.routing.manhattan2");

dojo.declare("boxgraph.routing.manhattan2", null,
{
    boxmanager:     "",
    sanitycheck:    8,
    
    constructor: function(args)
    {
        this.boxmanager = args.boxmanager;    
    },
    
    // fp - firstport - beginning, sp - secondport - end
    getRouting: function(fp, sp)
    {        
        console.log("--- getRouting called.");
        console.dir({fp: fp, sp: sp});
        var nextpoint = { x: fp.x, y: fp.y, dir: fp.dir };
        var rv = [nextpoint]; // Returns an array of {x:0, y:0} objects, beginning at fp
        var count = 0;
        while(!(nextpoint.x == sp.x && nextpoint.y == sp.y)) // Loop until the next point _is_ our destination
        {
            if(count++ > this.sanitycheck)
            {
                console.log("*** Sanity Check Fault. More than "+this.sanitycheck+" while loops to get points for route!");
                break;
            }
            //var dir = this.getDirection(nextpoint, sp); // If sp.x > fp.x and fp is located 'up', then direction is left
            //nextpoint.dir = dir;
            nextpoint = this.getNextPoint(nextpoint, sp);
            
            rv.push(nextpoint);
        }
        console.log("+++ getRouting while loop done. nextpoint.x = "+nextpoint.x+", nextpoint.y = "+nextpoint.y+", sp.x = "+sp.x+", sp.y = "+sp.y);
        rv.push(nextpoint); // And add that as well. We're home.
        return rv;
	},
    
    // The direction of a line. It is dependent on 1) The face of the box the first/beginning port is on and 2) on the +/- of the coord diff between fp & sp
    getDirection: function(fp, sp)
    {
        //
        var dir = -1;
        switch(fp.dir)
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
        console.log("=== getDirection for direction '"+fp.dir+"', returns '"+dir+"'");
        return dir;
    },
    
    // Uses the boxmanager to search for the next empty space for a given direction. E.g. a coordinate which is not inside a box in the line of directions.
    getNextPoint: function(startpoint, sp)
    {
        var goodpoint = this.boxmanager.getGoodPointFor(startpoint, sp);
        goodpoint.dir = this.getDirection(goodpoint, sp);
        console.log("getNextPoint for dir '"+startpoint.dir+"'");
        console.dir({startpoint: startpoint, nextpoint: goodpoint});
        return goodpoint;
    }
});
