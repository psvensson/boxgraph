dojo.provide("boxgraph.boxmanager");


dojo.declare("boxgraph.boxmanager", null,
{
    boxes:      [],
    xlist:      [],
    ylist:      [],
    margin:     10, // Margin in Canvas px that we want a gap between boxes to have
    
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
    getGoodPointFor: function(start, destination)
    {
        var dest = this.getPaddingFor(destination);
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
        target[otheraxis]   = dest[otheraxis];
        target[axis]        = start[axis] ;
        console.log("getGoodPointFor -- dir = "+dir+",  start["+axis+"] = "+start[axis]+", start["+otheraxis+"] = "+start[otheraxis]+", target["+axis+"] = "+target[axis]+", target["+otheraxis+"] = "+target[otheraxis]);
        // Now we have a target point
        
        // We want to get from start[axis] to target[axis], e.g. start.x to target.x 
        // We need to see if there are any boxes which block the way to dest[axis] and end the chase there.        
            
        rv = target; // default
        if(start.collidedwith)
        {
            // We collided with a box last point. This point must find a way to clear the box.
            // The collission occured because our target was behind the box, somwhere. That means we must move sideways.
            // If the start point direction is up, we must go either left or right (with margin) to clear the box.
            var collidedwith = start.collidedwith.model;
            console.log("last point was a collision with");
            console.dir(collidedwith);
            var midx = collidedwith.x + collidedwith.width/2;
            var midy = collidedwith.y + collidedwith.height/2;
            console.log("midx = "+midx+", midy = "+midy);
            switch(start.dir)
            {
                case "up":
                case "down":
                    rv.x = parseInt(rv.x < midx ? collidedwith.x - 30 : collidedwith.x + collidedwith.width + 30);
                    rv.y = start.y;
                break;
                case "right":
                case "left":
                    rv.x = start.x;
                    rv.y = parseInt(rv.y < midy ? collidedwith.y - 30 : collidedwith.y + collidedwith.height + 30);
                break;
            }
            delete start.collidedwith;
        }
        else
        {
            for(var i = 0; i < list.length; i++)
            {
                try
                {
                    //console.log("+++++++++++++++++++++++ checking box "+i+" of "+list.length);
                    var box = list[i];                
                    var collision = this.intersectBox(start, target, box.model);
                    //
                    // TODO: If a collision occurs, tag the returned point that the next point is going to find the side of the collided box instead of ultimate target
                    //
                    if(collision.x)
                    {
                        console.dir(collision);                                 
                        rv = collision;
                        rv.collidedwith = box;
                        //console.log("      Collission detected...");
                        break;
                    }              
                }
                catch(e)
                {
                    console.log("ERROR**** "+e);   
                }           
            }        
        }
        rv.dir = start.dir;
        console.log("+++ getGoodPointFor returning x: "+rv.x+", y: "+rv.y+", dir: "+rv.dir);
        return rv;
    },
    
    getPaddingFor: function(point)
    {
      var rv = {x: point.x, y: point.y, dir: point.dir};
      switch(point.dir)
      {
        case "up":
            rv.y -= this.margin;
            break;
        case "down":
            rv.y += this.margin;
            break;
        case "right":
            rv.x += this.margin;
            break;
        case "left":
            rv.x -= this.margin;
            break;
      }
      return rv;
    },
    
    intersectBox: function(start, end, box)
    {
        
        var rv      = {};
        
        var startwithinx = start.x > box.x && start.x < box.x + box.width;
        var startwithiny = start.y > box.y && start.y < box.y + box.height;
        
        var endwithinx = end.x > box.x && end.x < box.x + box.width;
        var endwithiny = end.y > box.y && end.y < box.y + box.height;
        
        var crossxr = start.x > box.x + box.width  && end.x < box.x ;
        var crossxl = end.x > box.x + box.width  && start.x < box.x ;
        
        var crossyr = start.y > box.y + box.height && end.y < box.y;
        var crossyl = end.y > box.y + box.height && start.y < box.y;
        
        //console.log("  intersectbox start.x = "+start.x+", start.y = "+start.y+", end.x = "+end.x+", end.y = "+end.y+", box.x = "+box.x+", box.y = "+box.y+", box.x+width = "+(box.x+box.width)+", box.y+height = "+(box.y+box.height));
        //console.log("    intersectBox startwithinx = "+startwithinx+", startwithiny = "+startwithiny+", endwithinx = "+endwithinx+", endwithiny = "+endwithiny+", crossxr = "+crossxr+", crossxl = "+crossxl+", crossyr = "+crossyr+", crossyl = "+crossyl);
        if (startwithiny && endwithiny && (crossxr || crossxl) )
        {            
            console.log("      Collision crossx!");
            rv.x    = crossxr ? box.x + box.width + 30 : box.x - 30;
            //rv.y    = end.y < box.y + box.height/2 ? box.y - 30 : box.y + box.height + 30;         
            rv.y = end.y;
        }
        else if (startwithinx && endwithinx && (crossyr || crossyl)) 
        {
            console.log("      Collision crossy!");
            //rv.x    = end.x < box.x + box.width/2 ? box.x - 30 : box.x + box.width + 30;
            rv.x = end.x;
            rv.y    = crossyr ? box.y + box.height + 30 : box.y - 30;
        }
        
        // TODO: When the target point is at a right angle to the rv point and the rv collision point is in its path, this will lead to 'oscillation' where getGoodPointFor will give same point all the time
        // It will want to 
        
        /*
        else if ((startwithiny && endwithinx) || ( startwithinx && endwithiny))
        {
            rv = true;
        }
        */
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