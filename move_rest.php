<?php
function replaceInAllFiles($search, $replace) {
    $dirs = ['app/', 'database/', 'routes/'];
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) continue;
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                $content = file_get_contents($file->getRealPath());
                $newContent = str_replace($search, $replace, $content);
                if ($content !== $newContent) {
                    file_put_contents($file->getRealPath(), $newContent);
                }
            }
        }
    }
}

$moves = [
    'AI' => 'AI',
    'Auth' => 'Auth',
    'CRM' => 'CRM',
    'Core' => 'Core',
    'Reports' => 'Reports',
    'Settings' => 'Settings',
];

foreach ($moves as $src => $dest) {
    $srcDir = "app/Http/Controllers/$src";
    $destDir = "app/Modules/$dest/Controllers";
    
    if (is_dir($srcDir)) {
        @mkdir($destDir, 0777, true);
        $files = scandir($srcDir);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
                rename("$srcDir/$file", "$destDir/$file");
                
                $className = pathinfo($file, PATHINFO_FILENAME);
                replaceInAllFiles("App\Http\Controllers\\$src\\$className", "App\Modules\\$dest\Controllers\\$className");
                
                $content = file_get_contents("$destDir/$file");
                $content = str_replace("namespace App\Http\Controllers\\$src;", "namespace App\Modules\\$dest\Controllers;", $content);
                file_put_contents("$destDir/$file", $content);
            }
        }
        @rmdir($srcDir);
    }
}

echo "Moved the rest of controllers.\n";
