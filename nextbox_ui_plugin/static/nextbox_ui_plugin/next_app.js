(function (nx) {
    /**
     * NeXt UI base application
     */

    // Initialize topology
    var topo = new nx.graphic.Topology({
        adaptive: true,
        // Dataprocessor is responsible for spreading 
        // the Nodes across the view.
        // 'force' dataprocessor spreads the Nodes so
        // they would be as distant from each other
        // as possible. Follow social distancing and stay healthy.
        // 'quick' dataprocessor picks random positions
        // for the Nodes.
        dataProcessor: 'force',
        // Node and Link identity key attribute name
        identityKey: 'id',
        // Node settings
        nodeConfig: {
            label: 'model.name',
            iconType:'model.icon',
            color: function(model) {
                if (model._data.is_new === 'yes') {
                    return '#148D09'
                }
            },
        },
        // Node Set settings (for future use)
        nodeSetConfig: {
            label: 'model.name',
            iconType: 'model.iconType'
        },
        // Tooltip content settings
        tooltipManagerConfig: {
            nodeTooltipContentClass: 'CustomNodeTooltip'
        },
        // Link settings
        linkConfig: {
            // Display Links as curves in case of 
            //multiple links between Node Pairs.
            // Set to 'parallel' to use parallel links.
            linkType: 'parallel',
            sourcelabel: 'model.srcIfName',
            targetlabel: 'model.tgtIfName',
            style: function(model) {
                if (model._data.is_dead === 'yes') {
                    return { 'stroke-dasharray': '5' }
                }
            },
            color: function(model) {
                if (model._data.is_dead === 'yes') {
                    return '#E40039'
                }
                if (model._data.is_new === 'yes') {
                    return '#148D09'
                }
            },
        },
        // Display Node icon. Displays a dot if set to 'false'.
        showIcon: true,
        linkInstanceClass: 'CustomLinkClass'
    });

    //register extra_icons
    for (icon of extra_icons) {
        topo.registerIcon(icon, "/static/nextbox_ui_plugin/img/"+icon+".png", 34, 34);
    }
    
    var Shell = nx.define(nx.ui.Application, {
        methods: {
            getContainer: function() {
                return new nx.dom.Element(document.getElementById('nx-ui-topology'));
            },
            start: function () {
                // Read topology data from variable
                topo.data(topologyData);
                
                // Attach it to the document
                topo.attach(this);
            }
        }
    });

    nx.define('CustomNodeTooltip', nx.ui.Component, {
        properties: {
            node: {},
            topology: {}
        },
        view: {
            content: [{
                tag: 'div',
                content: [{
                    tag: 'h5',
                    content: [{
                        tag: 'a',
                        content: '{#node.model.name}',
                        props: {"href": "{#node.model.dcimDeviceLink}", "target": "_blank", "rel": "noopener noreferrer"}
                    }],
                    props: {
                        "style": "border-bottom: dotted 1px; font-size:90%; word-wrap:normal; color:#003688"
                    }
                }, {
                    tag: 'p',
                    content: [
                        {
                        tag: 'label',
                        content: 'IP: ',
                    }, {
                        tag: 'label',
                        content: '{#node.model.primaryIP}',
                    }
                    ],
                    props: {
                        "style": "font-size:80%;"
                    }
                },{
                    tag: 'p',
                    content: [
                        {
                        tag: 'label',
                        content: 'Model: ',
                    }, {
                        tag: 'label',
                        content: '{#node.model.model}',
                    }
                    ],
                    props: {
                        "style": "font-size:80%;"
                    }
                }, {
                    tag: 'p',
                    content: [{
                        tag: 'label',
                        content: 'S/N: ',
                    }, {
                        tag: 'label',
                        content: '{#node.model.serial_number}',
                    }],
                    props: {
                        "style": "font-size:80%; padding:0"
                    }
                },
            ],
            props: {
                "style": "width: 150px;"
            }
        }]
        }
    });

    nx.define('Tooltip.Node', nx.ui.Component, {
        view: function(view){
            view.content.push({
            });
            return view;
        },
        methods: {
            attach: function(args) {
                this.inherited(args);
                this.model();
            }
        }
    });

    nx.define('CustomLinkClass', nx.graphic.Topology.Link, {
        properties: {
            sourcelabel: null,
            targetlabel: null
        },
        view: function(view) {
            view.content.push({
                name: 'source',
                type: 'nx.graphic.Text',
                props: {
                    'class': 'nav-link-text',
                    'alignment-baseline': 'text-after-edge',
                    'dominant-baseline': 'middle',
                    "style": "fill: currentColor",
                }
            }, {
                name: 'target',
                type: 'nx.graphic.Text',
                props: {
                    'class': 'nav-link-text',
                    'alignment-baseline': 'text-after-edge',
                    'dominant-baseline': 'middle',
                    "style": "fill: currentColor",
                }
            });
            
            return view;
        },
        methods: {
            update: function() {
                
                this.inherited();
                var el, point;
                var line = this.line();
                var angle = line.angle();
                var stageScale = this.stageScale()
                // pad line
                line = line.pad(18 * stageScale, 18 * stageScale);
                y_offset = (this._offsetRadix * this._offsetPercentage) * 2.1 * stageScale
                font_size = (12 * stageScale).toString() + "px"

                angle_rad = Math.PI / 180 * Math.abs(angle)
                
                x_offset = Math.abs(Math.sin(angle_rad*2)) * 12
                

                if (this.sourcelabel()) {
                    el = this.view('source');
                    point = line.start;

                    // Flip text 180 degrees
                    if (angle < -90 || angle > 90) {
                        el.set('transform', 'rotate(' + (parseInt(angle)+180).toString() + ' ' + point.x + ',' + point.y + ')');
                        el.set('text-anchor', 'end')
                        x = point.x - x_offset
                    } else {
                        el.set('transform', 'rotate(' + angle + ' ' + point.x + ',' + point.y + ')');
                        el.set('text-anchor', 'start')
                        x = point.x + x_offset
                    }
                    
                    y = point.y + y_offset
                    
                    el.set('x', x);
                    el.set('y', y);
                    el.set('text', this.sourcelabel());
                    el.setStyle('font-size', font_size);
                }
                
                if (this.targetlabel()) {
                    el = this.view('target');
                    point = line.end;
                   
                    // Flip text 180 degrees
                    if (angle < -90 || angle > 90) {
                        el.set('transform', 'rotate(' + (parseInt(angle)+180).toString() + ' ' + point.x + ',' + point.y + ')');
                        el.set('text-anchor', 'start')
                        x = point.x + x_offset
                    } else {
                        el.set('transform', 'rotate(' + angle + ' ' + point.x + ',' + point.y + ')');
                        el.set('text-anchor', 'end')
                        x = point.x - x_offset
                    }

                    y = point.y + y_offset
                    el.set('x', x);
                    el.set('y', y);
                    el.set('text', this.targetlabel());
                    el.setStyle('font-size', font_size);
                }
            }
        }
    });

    getCheckedValue = function (id) {
        element = document.getElementById(id)
        return element.checked
    }

    getRoleIds = function () {
        elements = document.querySelectorAll(".role")
        ids = Array.from(elements).map(ele => ele.id)
        return ids
    }

    getTagIds = function () {
        elements = document.querySelectorAll(".tag")
        ids = Array.from(elements).map(ele => ele.id)
        return ids
    }

    topologyFilter = function() {
        passive = getCheckedValue("passive")
        unconnected = getCheckedValue("unconnected")

        roleIds = getRoleIds()
        tagIds = getTagIds()

        //Loop over nodes
        for (var node of topologyData['nodes']) {
            if (node.isPassive) {
                topo.graph().getVertex(node.id).visible(passive);
                // If node is hidded by being passive, continue and skip other rules
                if (!passive) continue
            };
            

            if (topologyData['links'].filter(link => link['source'] === node.id | link['target'] === node.id).length == 0) {
                //If no links are connected to this node, considered unconnected.
                topo.graph().getVertex(node.id).visible(unconnected);
                // If node is hidded by being unconnected, continue and skip other rules
                if (!unconnected) continue 
            }

            //Loop over device roles
            for (var roleId of roleIds) {
                checkedValue = getCheckedValue(roleId)
                if (node['deviceRole'] == roleId) {
                    topo.graph().getVertex(node.id).visible(checkedValue);
                    break
                };
            }

            //Loop over device tags
            if (node['tags'].length < 1) {
                continue
            }
            for (var tagId of tagIds) {
                checkedValue = getCheckedValue(tagId)
                
                for (var tag of node.tags) {
                    if (tag == tagId) {
                        topo.graph().getVertex(node.id).visible(checkedValue);
                        break
                    };
                }
            }
        }
        //Loop over links
        for (var link of topologyData['links']) {
            //Logical multilink cable visibility
            if (link['isLogicalMultiCable']) {
                topo.getLink(link['id']).visible(!passive);
            };
        }  
    }


    saveView = function (topoSaveURI, CSRFToken) {
        var topoSaveName = document.getElementById('topoSaveName').value.trim();
        var saveButton = document.getElementById('saveTopologyView');
        var saveResultLabel = document.getElementById('saveResult');
        saveButton.setAttribute('disabled', true);
        saveResultLabel.setAttribute('innerHTML', 'Processing');
        fetch(topoSaveURI, {method: "POST", headers: {'X-CSRFToken': CSRFToken, 'Content-Type': "application/json"}, body: JSON.stringify({
            'name': topoSaveName,
            'topology': JSON.stringify(topo.data()),
            'layout_context': JSON.stringify({
                'displayUnconnected': !displayUnconnected,
                'undisplayedRoles': undisplayedRoles,
                'undisplayedDeviceTags': undisplayedDeviceTags,
                'displayPassiveDevices': !displayPassiveDevices,
                'displayLogicalMultiCableLinks': displayLogicalMultiCableLinks,
                'requestGET': requestGET,
            })
        })}).then(response => response.json()).then((data) => {
            saveResultLabel.innerHTML = 'Success';
            saveButton.removeAttribute('disabled');
            console.log(data);
        }).catch(error => {
            saveResultLabel.innerHTML = 'Failed';
            console.log(error);
        })
    };

    topo.on('topologyGenerated', function(){
        topologyFilter()
        // topologySavedData['nodes'].forEach(function(node){
        //     topo.graph().getVertex(node['id']).position({'x': node.x, 'y': node.y});
        // });
    });

    var shell = new Shell();
    shell.on('resize', function() {
        topo && topo.adaptToContainer();
    });
    // Run the application
    shell.start();
})(nx);

// Function to add eventlistener to dropdown buttons
// This is to properly use stopPropagation so the dropdown does not close onclick
(function () {
    var layer_inputs = document.getElementsByClassName("layer_input");
    function stopPropagation(event) {
        event.stopPropagation();
    }
    for (var i = 0; i < layer_inputs.length; i++) {
        layer_inputs[i].addEventListener('click', stopPropagation, false);
    }
})();