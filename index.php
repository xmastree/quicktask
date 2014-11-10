<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css" media="all"/>
    <link rel="stylesheet" href="/assets/common/css/templates.css" media="all"/>
</head>
<body>
<div class="container">
    <nav class="navbar navbar-default" role="navigation">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Quick task</a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav pull-right">
                <li id="load-status" class="hide"><a href="#" class="template-add-button"><i class="glyphicon glyphicon-refresh"></i> Loading...</a></li>
            </ul>
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">Get task text</a></li>
                <li><a href="#" class="template-add-button"><i class="glyphicon glyphicon-plus text-success"></i> Add template</a></li>
            </ul>
        </div>
    </nav>

    <h4 class="page-header">1. Select template</h4>

    <div class="row">
        <div class="col-xs-12">

            <select class="form-control" name="" id="template-list">
                <option value=""></option>
            </select>
            <small class="help text-muted text-sm">Can't find suitable template? <a href="#" class="template-add-button">Add it!</a></small>
        </div>
    </div>


    <div id="text-preview" class="hide">
        <label class="pull-right"><input type="checkbox" id="live-edit" checked="checked"/> Live edit</label>
        <h4 class="page-header">2. Set variables</h4>

        <div class="row">
            <div class="col-xs-12 col-md-6 col-lg-4">
                <div id="param-list">
                </div>
                <div class="form-group text-right">
                    <button class="btn" id="preview-clear">Clear</button>
                    <button class="btn btn-success" id="preview-compile">Get text</button>
                </div>
            </div>
            <div class="hidden-xs col-md-6 col-lg-8">
                <div class="well well-sm">
                    <samp class="preview" id="actual-preview-text">
                        This is some text with <a href="" data-param-ref="{{param}}"><code>{{param}}</code></a> value
                    </samp>
                </div>
                <small class="text-right help-block text-muted">
                    <a href="#" class="template-edit-button">Error in template?</a> |
                    <a href="#" class="template-remove-button">Remove template</a>
                </small>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="text-compiled">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                        class="sr-only">Close</span></button>
                <h4 class="modal-title">Get your text</h4>
            </div>
            <div class="modal-body">
                <textarea class="form-control" cols="5" rows="10"></textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Done</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="new-template">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                        class="sr-only">Close</span></button>
                <h4 class="modal-title"><i class="glyphicon glyphicon-plus text-success"></i> New template</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Template name: </label>
                    <input type="text" class="form-control"/>
                </div>
                <textarea class="form-control" cols="5" rows="10"></textarea>
                <small class="help-block text-muted">Use <code>{{placeholder}}</code> syntax to define own placeholders
                    in the text
                </small>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-success" data-dismiss="modal">Add template</button>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="/assets/jquery/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="/assets/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/assets/common/js/templates.js"></script>
</body>
</html>
