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
            var dir = this.getDirection(fp, sp); // If sp.x > fp.x and fp is located 'up', then direction is left
            nextpoint = this.getNextPoint(dir, nextpoint, sp);
            rv.push(nextpoint);
        }
        rv.push(nextpoint); // And add that as well. We're home.
        return rv;
	},
    
    getDirection: function(fp, sp)
    {
        
    },
    
    getNextPoint: function(dir, startpoint, sp)
    {
        
    }
});
