dojo.provide("boxgraph.routing.straight");

dojo.declare("boxgraph.routing.straight", null,
{
    getRouting: function(firstport, secondport)
    {
	var j = parseInt(firstport.side/2, 10);
	return {x1: firstport.x+j, y1: firstport.y+j, x2: secondport.x+j, y2: secondport.y+j}   ;
    }
});
