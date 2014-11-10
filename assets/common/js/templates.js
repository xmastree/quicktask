(function ($) {
    var api = '/templates/';
    $.ajaxSetup({
        beforeSend: function () {
            $('#load-status').removeClass('hide');
        },
        complete: function () {
            $('#load-status').addClass('hide');
        }
    });

    /**
     * @class Template
     *
     *
     * @param filename
     * @constructor
     */
    function Template(filename) {
        this.filename = filename;
        this.name = '';
        this.text = '';
        this.params = [];
    }

    /**
     * Load template data
     *
     * @param {Function} fn Called after data was loaded
     */
    Template.prototype.load = function (fn) {
        var self = this;
        $.get(api + '/' + this.filename)
            .done(function (data) {
                self.text = data.text;
                self.params = data.params;
                fn.call(self);
            });
    };

    /**
     * Execute callback for each template param
     *
     * @param {Function} fn Callback to execute
     */
    Template.prototype.paramsMap = function (fn) {
        for (var i = 0, l = this.params.length; i < l; i++) {
            fn.call(this, i, this.params[i]);
        }
    };

    /**
     * Get template text for preview
     * Apply nl2br transformation & replace static placeholders into clickable ones
     *
     * @returns {string} Preview text
     */
    Template.prototype.preview = function () {
        var text = this.text;
        this.paramsMap(function (n, param) {
            text = text.replace(param, '<a href="#" data-param-ref="' + param + '"><code>' + param + '</code></a>');
        });

        return (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
    };

    /**
     * Request builded template
     * Sends request to server and receive built template
     *
     * @param {Object} params Key-value pairs for placeholder substitution
     * @param {Function} fn Invokes with one argument after text was built. 1st arg - compiled text
     */
    Template.prototype.compile = function (params, fn) {
        $.get(api + '/' + this.filename, params)
            .done(function (data) {
                fn(data);
            });
    };


    /**
     * Save template
     *
     * @param {Function} err Invokes if error occurred. 1st arg - error text
     * @param {Function} fn Invokes if save success. 1st arg - template object
     */
    Template.prototype.save = function (err, fn) {
        var self = this;
        $.post(api, {name: this.name, text: this.text})
            .done(function (data) {
                self.filename = data.filename;
                self.name = data.name;
                self.text = data.text;
                self.params = data.params;

                fn.call(self);
            })
            .error(function (xhr) {
                err.call(self, xhr.responseText);
            });
    };

    /**
     * Delete template
     *
     * @param {Function} err Invokes if error occurred. 1st arg - error text
     * @param {Function} fn Invokes if delete success. 1st arg - template object
     */
    Template.prototype.delete = function (err, fn) {
        var self = this;

        $.ajax({
            url: api + '/' + this.filename,
            type: 'DELETE'
        })
            .done(function (filename) {
                self.filename = filename;
                fn.call(self);
            })
            .error(function (xhr) {
                err.call(self, xhr.responseText);
            })
    };


    /**
     * @class TemplateList
     *
     * @param selector
     * @param onSelect
     * @constructor
     */
    function TemplateList(selector, onSelect) {
        this.object = $(selector);
        this.list = [];
        this.selected = undefined;


        this.init(onSelect);
    }

    /**
     * Init template list
     *
     * @param {Function} onSelect Template select event handler
     */
    TemplateList.prototype.init = function (onSelect) {
        var self = this;

        this.object.on('change', function () {
            self.selected = this.value;
            onSelect.call(self);
        });
    };

    /**
     * Reset template selection
     */
    TemplateList.prototype.reset = function () {
        this.object.val('');
    };


    /**
     * Load templates list
     *
     * @param {Function} fn Invokes after list was loaded within template list scope.
     */
    TemplateList.prototype.load = function (fn) {
        var self = this;
        self.list = [];
        $.get(api)
            .done(function (data) {
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        var t = new Template(k);
                        t.name = data[k];

                        self.list.push(t);
                    }
                }

                fn.call(self);
            });

    };

    /**
     * Update template list
     *
     * @param {Template} activate Optional, select given template after load complete
     */
    TemplateList.prototype.update = function (activate) {
        this.load(function () {
            this.object.html('<option value=""></option>');

            for (var k in this.list) {
                if (this.list.hasOwnProperty(k)) {
                    this.object.append('<option value="' + this.list[k].filename + '">' + this.list[k].name + '</option>');
                }
            }

            if (activate) {
                this.object.val(activate.filename);
            }
        });
    };

    /**
     * Get template list entry
     * Return not-fully loaded template entry from list
     *
     * @param {string} filename Template filename to search for
     * @returns {Template} Partial template entry
     */
    TemplateList.prototype.getTemplate = function (filename) {
        for (var k in this.list) {
            if (this.list.hasOwnProperty(k) && this.list[k].filename == filename) {
                return this.list[k];
            }
        }

        return undefined;
    };

    /**
     * Returns currently selected template
     * @returns {Template}
     */
    TemplateList.prototype.getSelectedTemplate = function () {
        return this.getTemplate(this.selected);
    };

    /**
     * Class ParamsList
     *
     * @param {string} selector
     * @constructor
     */
    function ParamsList(selector) {
        this.object = $(selector);
        this.list = [];
        this.liveEdit = true;

        this._cache = {};

        this.init();
    }

    /**
     * Initialize parameters list.
     * Function setup input event handlers
     */
    ParamsList.prototype.init = function () {
        var self = this;

        this.object.on('keyup', 'input', function () {
            if (!self.liveEdit) {
                return;
            }

            var v = this.value;
            var p = $(this).data('param');

            if (!self._cache[p]) {
                self._cache[p] = $('[data-param-ref="' + p + '"]>code');
            }

            self._cache[p].text(v ? v : p);
        });

        this.liveEdit = $('#live-edit').prop('checked');

        $('#preview-clear').on('click', function () {
            params.reset();
        });

    };

    /**
     * Clear params list
     */
    ParamsList.prototype.clear = function () {
        this._cache = {};
        this.object.empty();
        this.list = [];
    };

    /**
     * Reset params list (set input values to empty)
     */
    ParamsList.prototype.reset = function () {
        this.object.find('input').val('').trigger('keyup');
    };

    /**
     * Add parameter to list
     * @param {string} name Parameter name
     */
    ParamsList.prototype.addParam = function (name) {
        this.list.push(name);

        var displayName = name.replace('{{', '').replace('}}', '');

        var html = '<div class="form-group"><label>' + displayName + '</label>'
            + '<input class="form-control" data-param="' + name + '"/></div>';

        this.object.append(html);
    };

    /**
     * Serialize params values into object
     *
     * @returns {Object}
     */
    ParamsList.prototype.serialize = function () {
        var values = {};
        this.object.find('[data-param]').each(function () {
            var k = $(this).data('param');
            values[k.substr(2, k.length - 4)] = this.value || '';
        });

        return values;
    };

    /**
     * Class PreviewBox
     *
     * @param {string} selector
     * @param {ParamsList} paramsList
     * @constructor
     */
    function PreviewBox(selector, paramsList) {
        this.container = $(selector);
        this.object = this.container.find('.preview');
        this.params = paramsList;
        this.template = undefined;

        this.init();
    }

    /**
     * Init preview box
     * Set event handlers
     */
    PreviewBox.prototype.init = function () {
        var self = this;
        this.object.on('click', '[data-param-ref]', function (e) {
            e.preventDefault();
            $('[data-param="' + $(this).data('param-ref') + '"]').focus().select();
        });

        this.container.find('#live-edit').on('change', function (e) {
            self.params.liveEdit = $(this).prop('checked');
        });

        $('#preview-compile').on('click', function () {
            self.compile();
        });
    };

    /**
     * Hide preview box and step-2 container
     */
    PreviewBox.prototype.clear = function () {
        this.container.addClass('hide');
        this.object.empty();
    };

    /**
     * Set template to preview
     *
     * @param {Template} template
     */
    PreviewBox.prototype.preview = function (template) {
        var self = this;
        this.clear();
        this.template = template;
        this.container.removeClass('hide');
        this.object.append(template.preview());

        this.params.clear();

        this.template.paramsMap(function (n, param) {
            self.params.addParam(param);
        });
    };

    /**
     * Display compiled template
     */
    PreviewBox.prototype.compile = function () {
        if (this.template) {
            this.template.compile(this.params.serialize(), function (text) {
                var m = $('#text-compiled');
                m.find('textarea').val(text).select();
                m.modal();
            });
        }
    };

    /**
     * @class TemplateEditor
     *
     * @param {PreviewBox} preview
     * @param {TemplateList} list
     * @constructor
     */
    function TemplateEditor(preview, list) {
        var self = this;
        this.template = undefined;
        this.preview = preview;

        var err = function (text) {
            alert(text);
        };

        var done = function () {
            preview.preview(this);

            list.update(this);
        };

        $('.template-edit-button').on('click', function (e) {
            e.preventDefault();
            self.edit(preview.template, err, done);
        });

        $('.template-add-button').on('click', function (e) {
            e.preventDefault();
            self.add(preview.template, err, done);
        });

        $('.template-remove-button').on('click', function (e) {
            e.preventDefault();
            if (confirm('Are you sure?')) {
                self.preview.template.delete(err, function () {
                    preview.clear();
                    list.update();
                });
            }
        });
    }

    /**
     * Display edit modal
     *
     * @param {Function} onSave Action to perform when save button pressed.
     * As first arg func gets newly created template
     */
    TemplateEditor.prototype.display = function (onSave) {
        var self = this;
        var m = $('#new-template'),
            n = m.find('input'),
            t = m.find('textarea'),
            b = m.find('.btn-success');

        if (this.template) {
            n.val(this.template.name);
            t.val(this.template.text);
            b.text('Save changes');
        } else {
            n.val('');
            t.val('');
            b.text('Save template');
        }

        b.unbind('click').on('click', function () {
            var newTpl = new Template();
            newTpl.name = n.val();
            newTpl.text = t.val();

            onSave.call(self, newTpl);
        });

        m.modal();
    };

    /**
     * Invoke template edit procedure
     *
     * @param {Template} template Template to edit
     * @param {Function} err  Calls in failure case
     * @param {Function} done Calls in success case
     */
    TemplateEditor.prototype.edit = function (template, err, done) {
        this.template = template;
        this.display(function (t) {
            t.save(err, done)
        });
    };

    /**
     * Invoke template create procedure
     *
     * @param {Template} template Template to create
     * @param {Function} err  Calls in failure case
     * @param {Function} done Calls in success case
     */
    TemplateEditor.prototype.add = function (template, err, done) {
        this.template = undefined;
        this.display(function (t) {
            t.save(err, done)
        });
    };


    /**
     * Application setup
     */
    var params = new ParamsList('#param-list');
    var preview = new PreviewBox('#text-preview', params);

    var list = new TemplateList('#template-list', function () {
        var template = this.getSelectedTemplate();
        if (template) {
            template.load(function () {
                preview.preview(this);
            });
        } else {
            preview.clear();
        }
    });

    var editor = new TemplateEditor(preview, list);

    list.update();
})
(jQuery);