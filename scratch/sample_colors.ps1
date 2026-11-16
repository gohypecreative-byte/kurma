Add-Type -AssemblyName System.Drawing
$filePath = "C:\Users\Vishan singh\.gemini\antigravity\brain\d2e18d37-4349-4a88-be91-68371ccf3c44\.user_uploaded\media_1794814103514_417091d2.jpg"
$bmp = New-Object System.Drawing.Bitmap($filePath)

for ($y = 280; $y -le 320; $y += 3) {
    for ($x = 25; $x -le 50; $x += 3) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 70 -and $c.G -lt 60) {
            Write-Host "Btn at $x,$y : #$($c.R.ToString('X2'))$($c.G.ToString('X2'))$($c.B.ToString('X2'))"
        }
    }
}

# Star color in cards
for ($y = 240; $y -le 260; $y += 2) {
    for ($x = 130; $x -le 190; $x += 5) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 200 -and $c.G -gt 150 -and $c.B -lt 100) {
            Write-Host "Star at $x,$y : #$($c.R.ToString('X2'))$($c.G.ToString('X2'))$($c.B.ToString('X2'))"
        }
    }
}

$bmp.Dispose()
