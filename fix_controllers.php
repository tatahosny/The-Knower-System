<?php
$files = glob("app/Modules/*/Controllers/*.php");
foreach ($files as $file) {
    $content = file_get_contents($file);
    if (str_contains($content, '->validated()')) {
        $content = str_replace('->validated()', '->all()', $content);
        file_put_contents($file, $content);
        echo "Fixed $file\n";
    }
}
