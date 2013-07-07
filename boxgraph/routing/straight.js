define(
    [
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",

        "dojo/dom-style",
        "dojo/_base/fx",
        "dojo/_base/lang",
        "dojox/gfx",
        "boxgraph/port",
        "boxgraph/portmanager",
        "boxgraph/boxmanager",
        "boxgraph/base",
        "dojo/on"
    ],
    function(declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
             domStyle, baseFx, lang, gfx, port, portmanager, boxmanager,
             base, on)
    {
        return declare([],
            {
    getRouting: function(firstport, secondport)
    {
	var j = parseInt(firstport.side/2, 10);
	return {x1: firstport.x+j, y1: firstport.y+j, x2: secondport.x+j,
        y2: secondport.y+j}   ;
    }
})
    })
