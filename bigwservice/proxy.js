Ext.onReady(function() {
    store_dir = Ext.create('Ext.data.TreeStore', {
        proxy: {
            type: 'ajax',
            url: 'get_dir.php'
        }
    });

    tree_dir = Ext.create('Ext.tree.Panel', {
        title: 'Localhost Directory',
        rootVisible: false,
        store: store_dir,
        split: true,
        region: 'west',
        collapsible: true,
        floatable: false,
        width: 200,
        useArrows: true,
        listeners: {
            itemclick: {
                fn: function(view, record, item, index, event) {
                    store_file.load({
                        url: 'get_file.php?dir=' + record.data.id
                    });

                    nodeId = record.data.id;
                    htmlId = item.id;
                }
            }

        }
    });

    Ext.define('File', {
       extend: 'Ext.data.Model',
       fields: ['filename', 'filesize', 'filedate']
    });

    store_file = Ext.create('Ext.data.Store', {
        model: 'File',
        proxy: {
          type: 'ajax',
          url: 'get_file.php',
          reader: {
              type: 'json',
              root: 'files'
          }
        }
    });

    grid_file = Ext.create('Ext.grid.Panel', {
        title: 'File List',
        region: 'center',
        store: store_file,
        columns: [
            { header: 'Name', width: 170, dataIndex: 'filename' },
            { header: 'Size', width: 100, dataIndex: 'filesize' },
            { header: 'Last Modified', width: 200, dataIndex: 'filedate' }
        ],
        viewConfig: {
            stripeRows: true
        }
    });

    win = Ext.create('widget.window', {
        title: 'ExtJS Simple File Browser',
        width: 700,
        height: 400,
        layout: 'border',
        bodyStyle: 'padding: 5px;',
        items: [tree_dir, grid_file]
    });

    win.show();
});