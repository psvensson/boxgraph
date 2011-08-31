dojo.provide("boxgraph.routing.curved");

dojo.require("boxgraph.routing.manhattan2");

dojo.declare("boxgraph.routing.curved", null,
{

		drawLine: function(ll, surface)
		{
			return surface.createPolyline(ll);
		},

		drawShadowLine: function(ll, surface)
		{
			return surface.createPolyline(ll);
		},

	getRouting: function(fp, secondport)
    {
        console.log("--- getRouting called.");
        var sp = {x: secondport.x+5 , y: secondport.y+5, dir: secondport.dir};
        //sp = this.boxmanager.getPaddingFor(sp);
        console.dir({fp: fp, sp: sp});
        var nextpoint = { x: fp.x + 5, y: fp.y + 5, dir: fp.dir };
        var rv = [nextpoint]; // Returns an array of {x:0, y:0} objects, beginning at fp
        nextpoint = this.boxmanager.getPaddingFor(nextpoint);
        rv.push(nextpoint);
        var count = 0;
        var absx = 100, absy = 100;
        while(!(absx < 21 && absy < 21 )) // Loop until the next point _is_ our destination
        {
            if(count++ > this.sanitycheck)
            {
                console.log("*** Sanity Check Fault. More than "+this.sanitycheck+" while loops to get points for route!");
                break;
            }
            //var dir = this.getDirection(nextpoint, sp); // If sp.x > fp.x and fp is located 'up', then direction is left
            //nextpoint.dir = dir;
            //console.log("Calling getNextGoodPoint for...");
            console.dir({fp: nextpoint, sp: sp});
            nextpoint = this.getNextPoint(nextpoint, sp);

            absx = Math.abs(nextpoint.x - sp.x);
            absy = Math.abs(nextpoint.y - sp.y);
            //console.log("getRouting nextpoint.x = "+nextpoint.x+", nextpoint.y = "+nextpoint.y+", sp.x = "+sp.x+", sp.y = "+sp.y+", dir = '"+nextpoint.dir+"', absx = "+absx+", absy = "+absy);
            rv.push(nextpoint);
        }
        console.log("+++ getRouting while loop done. nextpoint.x = "+nextpoint.x+", nextpoint.y = "+nextpoint.y+", sp.x = "+sp.x+", sp.y = "+sp.y);
        rv.push(nextpoint); // And add that as well. We're home.
        // Push last point
        rv.push({ x: sp.x , y: sp.y , dir: sp.dir });
        return rv;
	}

});
