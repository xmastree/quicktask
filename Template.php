<?php

/**
 * Class Template
 */

class Template
{

    /**
     * Wrappers for template variables
     */
    const WRAPPER_PREPEND = '{{';
    const WRAPPER_APPEND = '}}';

    /**
     * Full path to tpl folder
     *
     * @var
     */
    private $__templatesPath;

    /**
     * List of templates
     *
     * @var array
     */
    protected $_templatesMap = array();

    /**
     * @param string $templatesPath
     */
    public function __construct($templatesPath = 'tpl')
    {
        $this->__templatesPath = WWW_PATH . $templatesPath . DS;

        $templatesFileNames = scandir($this->__templatesPath);
        foreach ($templatesFileNames as $templateFileName) {
            if (!in_array($templateFileName, array('.', '..'))) {
                $templateName = preg_replace('/\\.[^.\\s]{3,4}$/', '', $templateFileName);
                $this->_templatesMap[$templateFileName] = ucfirst($templateName);
            }
        }
    }

    /**
     * Read template file
     *
     * @param null $templateFileName
     * @return bool|string
     */
    protected function _read($templateFileName = null)
    {
        $templateFullPath = $this->__templatesPath . $templateFileName;

        if (file_exists($templateFullPath)) {
            if (!isset($this->_templatesMap[$templateFileName])) {
                $templateName = preg_replace('/\\.[^.\\s]{3,4}$/', '', $templateFileName);
                $this->_templatesMap[$templateFileName] = ucfirst($templateName);
            }

            return file_get_contents($templateFullPath);
        }

        return false;
    }

    /**
     * Generate template data
     *
     * @param null $templateFileName
     * @return mixed
     * @throws Exception
     */
    protected function _readWithParams($templateFileName = null)
    {
        $templateContent = $this->_read($templateFileName);

        if (!$templateContent) {
            throw new Exception('Template not found!');
        }

        $template['name'] = preg_replace('/\\.[^.\\s]{3,4}$/', '', $templateFileName);
        $template['filename'] = $templateFileName;
        $template['text'] = $templateContent;
        $template['params'] = array();

        preg_match_all(
            '/(\\' . self::WRAPPER_PREPEND . '.*?\\' . self::WRAPPER_APPEND . ')/',
            $templateContent,
            $matches
        );

        $template['params'] = $matches[1];

        return $template;
    }

    /**
     * Get templates list
     *
     * @return array - [filename => displayname]
     */
    public function getList() {
        return $this->_templatesMap;
    }

    /**
     * Get Template data
     * nl2br for template content
     *
     * @param null $templateFileName
     * @return mixed
     * @throws Exception
     */
    public function getData($templateFileName = null)
    {
        $template = $this->_readWithParams($templateFileName);

        return $template;
    }

    /**
     * Generate output result
     * Replace template variables with params
     *
     * @param null $templateFileName
     * @param array $params
     * @return mixed
     * @throws Exception
     */
    public function generateOutputText($templateFileName = null, $params = array())
    {
        $templateContent = $this->_read($templateFileName);

        if (!$templateContent) {
            throw new Exception('Template not found!');
        }

        $outputContent = preg_replace_callback(
            '/(\\' . self::WRAPPER_PREPEND . '.*?\\' . self::WRAPPER_APPEND . ')/',
            function($matches) use ($params) {
                $match = str_replace(array(self::WRAPPER_PREPEND, self::WRAPPER_APPEND), array('', ''), $matches[1]);

                if (isset($params[$match])) {
                    return $params[$match];
                } else {
                    return '';
                }
            },
            $templateContent
        );

        return $outputContent;
    }

    /**
     * Add new or update existing template
     *
     * @param array $request
     * @throws Exception
     */
    public function save(array $request)
    {
        $templateFileName = $request['name'] . '.txt';

        if (!empty($request['text'])) {
            $template = fopen($this->__templatesPath . $templateFileName, 'w');

            fwrite($template, $request['text']);

            fclose($template);

            echo json_encode($this->_readWithParams($templateFileName));
        } else {
            header(' ', true, 400);
            echo 'Can not save empty Template!';
        }
    }

    /**
     * Delete method
     *
     * @param null $templateFileName
     */
    public function delete($templateFileName = null)
    {
        if(!unlink($this->__templatesPath . $templateFileName)) {
            header(' ', true, 400);
            echo 'Can not delete this Template!';
        }
    }

}