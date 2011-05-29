dojo.provide("drawutil.editor");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");

dojo.require("dojox.gfx");
dojo.require("drawutil.block");

dojo.declare("drawutil.editor", [ dijit._Widget, dijit._Templated ],
{
	templatePath			: dojo.moduleUrl("drawutil", "editor.html"),
    surface                 : "", // Can be provided, otherwise we create a new surface
    entities                : [],
    
    postCreate: function()
    {
        this.inherited(arguments);
        console.log("postCreate in drawutil.editor called");
        if(!this.surface)
        {
		    this.surface = dojox.gfx.createSurface(this.editordiv, 400, 400);
        }
        //----
        this.test();
    },
    
    test: function()
    {
        var block1 = new drawutil.block({surface: this.surface, model: {name:"foo", x:50, y: 150, height:100, width: 100} });
        block1.addPort({ where: "right", position: 1});
        block1.addPort({ where: "right", position: 2});
        var block2 = new drawutil.block({surface: this.surface, model: {name: "bar", x:250, y: 100, height:100, width: 100} });
        block2.addPort({ where: "left", position: 1});
        block2.addPort({ where: "left", position: 2});
        block2.addPort({ where: "top", position: 1});
        block1.addPort({ where: "bottom", position: 1});
        
        this.addEntity(block1);  
        this.addEntity(block2);
        block1.render();
        block2.render();
    },
    
    addEntity: function(e)
    {
        this.entities.push(e);
    }
});