<?php
$files = glob("app/Modules/*/Models/*.php");
foreach ($files as $file) {
    if (str_contains($file, 'Workspace.php') || str_contains($file, 'User.php')) continue;
    $content = file_get_contents($file);
    if (!str_contains($content, 'use HasWorkspace')) {
        $content = preg_replace('/class\s+[A-Za-z0-9_]+\s+extends\s+Model\s*\{/', "$0\n    use HasWorkspace, LogsActivity;\n", $content);
        file_put_contents($file, $content);
        echo "Fixed $file\n";
    }
}
