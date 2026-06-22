# Arrancar BetaTest en VS Code

El servidor que se abre desde Codex puede dejar de verse pasados unos minutos porque depende de una sesión temporal. Para trabajar de forma estable, arráncalo desde una terminal de VS Code y deja esa terminal abierta.

Comando recomendado:

```powershell
cd "C:\Users\atmin\Documents\Web BETA"
powershell -ExecutionPolicy Bypass -File ".\BetaTest\arrancar-beta.ps1" -Port 8123
```

Después abre:

```text
http://127.0.0.1:8123/BetaTest/
```

Si el puerto 8123 está ocupado:

```powershell
powershell -ExecutionPolicy Bypass -File ".\BetaTest\arrancar-beta.ps1" -Port 8124
```

Y abre:

```text
http://127.0.0.1:8124/BetaTest/
```
