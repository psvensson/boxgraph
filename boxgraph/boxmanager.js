dojo.provide("boxgraph.boxmanager");


dojo.declare("boxgraph.boxmanager", null,
{
    boxes:      [],
    xlist:      [],
    ylist:      [],
    margin:     14, // Margin in Canvas px that we want a gap between boxes to have
    
    constructor: function()
    {
        this.boxes = [];
        this.xlist = [];
        this.ylist = [];
    },
    
    addBox: function(newbox)
    {
        /*
        console.log("addBox called for "+newbox);
        console.log("xlist is.:");
        console.dir(this.xlist);
        console.log("ylist is..");
        console.dir(this.ylist);
        */
        this.boxes.push(newbox);
        // Make sure we create ordered list for x and y coordinates, so we quickly can iterate from low to high
        var xindex = 0;
        if(this.xlist.length == 0)
        {
            this.xlist.push(newbox);
            this.ylist.push(newbox);
        }
        else
        {
            for(var x=0; x< this.xlist.length; x++)
            {
                var xbox = this.xlist[x];
                if(xbox.model.x > newbox.model.x)
                {
                    xindex = x;
                    break;
                }
            }
            this.xlist.splice(xindex, 0, newbox); 
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
            this.ylist.splice(yindex, 0, newbox);
        }        
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
    getGoodPointFor: function(start, dest)
    {
        var rv = {x: -1, y: -1, dir: "whatever"};
        var dir = start.dir;
        if(dir == -1)
        {
            throw("''''' ARGH!! ''''");   
        }
        
        var list = (dir == "up" || dir == "down") ? this.ylist : this.xlist;
        var axis = (dir == "up" || dir == "down") ? "y" : "x";
        var otheraxis = (dir == "up" || dir == "down") ? "x" : "y";        
        
        var length          = (dir == "up" || dir == "down") ? "height" : "width";
        var otherlength     = (dir == "up" || dir == "down") ? "width" : "height";
        
        var target={};
        target[otheraxis]   = dest[otheraxis]  ;
        target[axis]        = start[axis] ;
        console.log("getGoodPointFor -- dir = "+dir+",  start["+axis+"] = "+start[axis]+", start["+otheraxis+"] = "+start[otheraxis]+", target["+axis+"] = "+target[axis]+", target["+otheraxis+"] = "+target[otheraxis]);
        // Now we have a target point
        
        // We want to get from start[axis] to target[axis], e.g. start.x to target.x 
        // We need to see if there are any boxes which block the way to dest[axis] and end the chase there.        
            
        rv = target; // default
        for(var i = 0; i < list.length; i++)
        {
            try
            {
                //console.log("+++++++++++++++++++++++ checking box "+i+" of "+list.length);
                var box = list[i];                
           
                if(this.intersectBox(start, target, box.model))
                {
                    var rva = parseInt(start[axis]) ;
                    var rvo = parseInt(box.model[otheraxis] - this.margin) ;
                    console.log("    collission. setting rv["+axis+"] to box.model["+axis+"] "+(box.model[axis])+" + this.margin "+this.margin+" == "+rva+", rv["+otheraxis+"] to dest["+otheraxis+"] "+dest[otheraxis]+" + this.margin == "+rvo);
                    // Collission. Sup before, chage dir and break
                    rv[axis]        = rva;
                    rv[otheraxis]   = rvo;                    
                    break;
                }              
            }
            catch(e)
            {
                console.log("ERROR**** "+e);   
            }           
        }        
        rv.dir = start.dir;
        console.log("+++ getGoodPointFor called. axis = '"+axis+"', otheraxis = '"+otheraxis+"', returning x: "+rv.x+", y: "+rv.y+", dir: "+rv.dir);
        return rv;
    },
    
    intersectBox: function(start, end, box)
    {
        
        var rv = false;
        var startwithinx = start.x > box.x && start.x < box.x + box.width;
        var startwithiny = start.y > box.y && start.y < box.y + box.height;
        
        var endwithinx = end.x > box.x && end.x < box.x + box.width;
        var endwithiny = end.y > box.y && end.y < box.y + box.height;
        
        var crossx = start.x < box.x && end.x > box.x + box.width;
        var crossy = start.y < box.y && end.y > box.y + box.height;
        //console.log("  intersectBox startwithinx = "+startwithinx+", startwithiny = "+startwithiny+", endwithinx = "+endwithinx+", endwithiny = "+endwithiny+", crossx = "+crossx+", crossy = "+crossy);
        if ((startwithiny && endwithiny && crossx ) || (startwithinx && endwithinx && crossy) || (startwithiny && endwithiny) || (startwithinx && endwithinx))
        {
            rv = true;   
        }
        return rv;
    },
    
    ccw: function(A,B,C)
    {
        return (C.y-A.y)*(B.x-A.x) > (B.y-A.y)*(C.x-A.x);
    },
    
    intersect: function(A,B,C,D)
    {
        var rv = this.ccw(A,C,D) != this.ccw(B,C,D) && this.ccw(A,B,C) != this.ccw(A,B,D);;
        console.log("intersect says "+rv);
        return rv;
    }
});