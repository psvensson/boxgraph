dojo.provide("boxgraph.boxmanager");


dojo.declare("boxgraph.boxmanager", null,
{
    boxes:      [],
    xlist:      [],
    ylist:      [],
    margin:     20, // Margin in Canvas px that we want a gap between boxes to have
    
    constructor: function()
    {
        this.boxes = [];
        this.xlist = [];
        this.ylist = [];
    },
    
    addBox: function(newbox)
    {
        this.boxes.push(newbox);
        // Make sure we create ordered list for x and y coordinates, so we quickly can iterate from low to high
        var xindex = 0;
        for(var x=0; x< this.xlist.length; x++)
        {
            var xbox = this.xlist[x];
            if(xbox.model.x > newbox.model.x)
            {
                xindex = x;
                break;
            }
        }
        this.xlist.splice(xindex, 1, newbox); 
        var yindex = 0;
        for(var y=0; y< this.ylist.length; y++)
        {
            var ybox = this.ylist[y];
            if(ybox.model.y > newbox.model.y)
            {
                yindex = y;
                break;
            }
        }
        this.ylist.splice(yindex, 1, newbox); 
    },
    
    getBoxes: function()
    {
        return this.boxes;   
    },
    
    // dir is direction, which also defines which axis we're interested in.
    // From the startingpoints relevant axis (defined by dir) we see if the destination point axis is not within any boxes
    // If the destination axis point (e.g. dest.x for left or right) is within a box, then we give the margin axis point before
    // that box and return, but make sure to change dir on the returned point so it strives towards the other axis, as we've now
    // exhausted or potential on the axis of the current one.
    //
    // The use of axis here can mean 'x' or 'y' depending on direcitons, this also relates to the lenght and otherlength properties which are 'length' and 'width' of a box depending again on direction
    // This makes the method harder to read, I guess, but more DRY and versatile. YMMV.
    getGoodPointFor: function(dir, start, dest)
    {
        var rv = {x: -1, y: -1, dir: "whatever"};
        
        var list = (dir == "up" || dir == "down") ? this.ylist : this.xlist;
        var axis = (dir == "up" || dir == "down") ? "y" : "x";
        var otheraxis = (dir == "up" || dir == "down") ? "x" : "y";
        
        var length          = (dir == "up" || dir == "down") ? "height" : "width";
        var otherlength     = (dir == "up" || dir == "down") ? "width" : "height";
        
        var target={};
        target[otheraxis]   = start[otheraxis];
        target[axis]        = dest[axis];
        // Now we have a target point
        
        // We want to get from start[axis] to target[axis], e.g. start.x to target.x 
        // We need to see if there are any boxes which block the way to dest[axis] and end the chase there.        
            
        if(list.length > 1)
        {
            for(var i = 1; i < list.length; i++)
            {
                var box = list[i];
                // Do we have a gap between the boxes?
                if(parseInt(box.model[axis])+parseInt(box.model[length]) > target[axis] && parseInt(box.model[axis]) < target[axis]) // target[axis] is within the box axis
                {
                    if(parseInt(box.model[otheraxis])+parseInt(box.model[otherlength]) > target[otheraxis] && parseInt(box.model[otheraxis]) < target[otheraxis]) // target[axis] is within the box axis
                    {
                        // Collission. Stop before, chage dir and break
                        rv[axis] = parseInt(box.model[axis]) - this.margin;
                        rv[otheraxis] = starts[otheraxis];
                        break;
                    }                 
                }                
            } 
        }       
        
        return rv;
    }
    
});