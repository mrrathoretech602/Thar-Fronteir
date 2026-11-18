using System;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Windows.Forms;
using System.Drawing;
using System.Diagnostics;
using System.Threading;

namespace TharFrontierInstaller
{
    public class InstallerForm : Form
    {
        private Label lblTitle;
        private Label lblSub;
        private Label lblInstallDir;
        private TextBox txtInstallDir;
        private Button btnBrowse;
        private CheckBox chkDesktopShortcut;
        private CheckBox chkLaunchNow;
        private ProgressBar progressBar;
        private Label lblStatus;
        private Button btnInstall;
        private Button btnCancel;

        private string defaultPath;
        private bool isInstalling = false;

        [STAThread]
        public static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
        }

        public InstallerForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "THAR FRONTIER: A SOLDIER'S PROMISE · 1971 — Installer";
            this.Size = new Size(540, 390);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(11, 14, 20);
            this.ForeColor = Color.White;

            // Load icon if available from executing assembly
            try
            {
                this.Icon = Icon.ExtractAssociatedIcon(Assembly.GetExecutingAssembly().Location);
            }
            catch { }

            // Title Banner
            lblTitle = new Label();
            lblTitle.Text = "🇮🇳 THAR FRONTIER: A SOLDIER'S PROMISE · 1971";
            lblTitle.Font = new Font("Segoe UI", 12.5f, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(229, 184, 66); // Gold
            lblTitle.Location = new Point(20, 18);
            lblTitle.Size = new Size(490, 28);
            this.Controls.Add(lblTitle);

            lblSub = new Label();
            lblSub.Text = "Indian Army Cinematic 2.5D PC Game · Battle of Longewala, Rajasthan";
            lblSub.Font = new Font("Segoe UI", 8.8f, FontStyle.Regular);
            lblSub.ForeColor = Color.FromArgb(255, 140, 43); // Saffron
            lblSub.Location = new Point(22, 46);
            lblSub.Size = new Size(490, 20);
            this.Controls.Add(lblSub);

            // Separator Line
            Panel sep = new Panel();
            sep.Location = new Point(20, 72);
            sep.Size = new Size(485, 1);
            sep.BackColor = Color.FromArgb(40, 50, 70);
            this.Controls.Add(sep);

            // Install Path Label & TextBox
            lblInstallDir = new Label();
            lblInstallDir.Text = "Installation Folder:";
            lblInstallDir.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
            lblInstallDir.ForeColor = Color.FromArgb(200, 210, 225);
            lblInstallDir.Location = new Point(20, 85);
            lblInstallDir.Size = new Size(300, 18);
            this.Controls.Add(lblInstallDir);

            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            defaultPath = Path.Combine(localAppData, "Programs", "TharFrontier1971");

            txtInstallDir = new TextBox();
            txtInstallDir.Text = defaultPath;
            txtInstallDir.Font = new Font("Segoe UI", 9f);
            txtInstallDir.BackColor = Color.FromArgb(20, 26, 38);
            txtInstallDir.ForeColor = Color.White;
            txtInstallDir.BorderStyle = BorderStyle.FixedSingle;
            txtInstallDir.Location = new Point(22, 108);
            txtInstallDir.Size = new Size(390, 24);
            this.Controls.Add(txtInstallDir);

            btnBrowse = new Button();
            btnBrowse.Text = "Browse...";
            btnBrowse.Font = new Font("Segoe UI", 8.5f);
            btnBrowse.BackColor = Color.FromArgb(30, 40, 58);
            btnBrowse.ForeColor = Color.White;
            btnBrowse.FlatStyle = FlatStyle.Flat;
            btnBrowse.FlatAppearance.BorderColor = Color.FromArgb(60, 75, 105);
            btnBrowse.Location = new Point(420, 107);
            btnBrowse.Size = new Size(85, 26);
            btnBrowse.Click += BtnBrowse_Click;
            this.Controls.Add(btnBrowse);

            // Checkboxes
            chkDesktopShortcut = new CheckBox();
            chkDesktopShortcut.Text = "Create Desktop Shortcut with Havaldar Devrath badge";
            chkDesktopShortcut.Font = new Font("Segoe UI", 9f);
            chkDesktopShortcut.ForeColor = Color.FromArgb(210, 220, 235);
            chkDesktopShortcut.Location = new Point(22, 148);
            chkDesktopShortcut.Size = new Size(480, 22);
            chkDesktopShortcut.Checked = true;
            this.Controls.Add(chkDesktopShortcut);

            chkLaunchNow = new CheckBox();
            chkLaunchNow.Text = "Launch THAR FRONTIER immediately after install";
            chkLaunchNow.Font = new Font("Segoe UI", 9f);
            chkLaunchNow.ForeColor = Color.FromArgb(210, 220, 235);
            chkLaunchNow.Location = new Point(22, 174);
            chkLaunchNow.Size = new Size(480, 22);
            chkLaunchNow.Checked = true;
            this.Controls.Add(chkLaunchNow);

            // Progress Bar
            progressBar = new ProgressBar();
            progressBar.Location = new Point(22, 215);
            progressBar.Size = new Size(483, 22);
            progressBar.Style = ProgressBarStyle.Continuous;
            this.Controls.Add(progressBar);

            // Status Label
            lblStatus = new Label();
            lblStatus.Text = "Ready to install. Click 'Install & Play' to begin!";
            lblStatus.Font = new Font("Segoe UI", 8.5f);
            lblStatus.ForeColor = Color.FromArgb(160, 175, 195);
            lblStatus.Location = new Point(22, 243);
            lblStatus.Size = new Size(483, 20);
            this.Controls.Add(lblStatus);

            // Action Buttons
            btnInstall = new Button();
            btnInstall.Text = "⚡ INSTALL & PLAY NOW";
            btnInstall.Font = new Font("Segoe UI", 10.5f, FontStyle.Bold);
            btnInstall.BackColor = Color.FromArgb(212, 175, 55); // Gold
            btnInstall.ForeColor = Color.Black;
            btnInstall.FlatStyle = FlatStyle.Flat;
            btnInstall.FlatAppearance.BorderSize = 0;
            btnInstall.Cursor = Cursors.Hand;
            btnInstall.Location = new Point(195, 285);
            btnInstall.Size = new Size(205, 42);
            btnInstall.Click += BtnInstall_Click;
            this.Controls.Add(btnInstall);

            btnCancel = new Button();
            btnCancel.Text = "Cancel";
            btnCancel.Font = new Font("Segoe UI", 9.5f);
            btnCancel.BackColor = Color.FromArgb(25, 33, 48);
            btnCancel.ForeColor = Color.FromArgb(190, 200, 215);
            btnCancel.FlatStyle = FlatStyle.Flat;
            btnCancel.FlatAppearance.BorderColor = Color.FromArgb(50, 65, 90);
            btnCancel.Location = new Point(410, 285);
            btnCancel.Size = new Size(95, 42);
            btnCancel.Click += (s, e) => { if (!isInstalling) this.Close(); };
            this.Controls.Add(btnCancel);
        }

        private void BtnBrowse_Click(object sender, EventArgs e)
        {
            using (FolderBrowserDialog fbd = new FolderBrowserDialog())
            {
                fbd.Description = "Select Installation Folder for Thar Frontier 1971";
                fbd.SelectedPath = txtInstallDir.Text;
                if (fbd.ShowDialog() == DialogResult.OK)
                {
                    txtInstallDir.Text = Path.Combine(fbd.SelectedPath, "TharFrontier1971");
                }
            }
        }

        private void BtnInstall_Click(object sender, EventArgs e)
        {
            if (isInstalling) return;

            string targetDir = txtInstallDir.Text.Trim();
            if (string.IsNullOrEmpty(targetDir))
            {
                MessageBox.Show("Please choose a valid destination folder.", "Invalid Folder", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            isInstalling = true;
            btnInstall.Enabled = false;
            btnBrowse.Enabled = false;
            txtInstallDir.Enabled = false;
            chkDesktopShortcut.Enabled = false;
            chkLaunchNow.Enabled = false;
            btnCancel.Enabled = false;
            btnInstall.Text = "Installing...";

            bool createShortcut = chkDesktopShortcut.Checked;
            bool launchWhenDone = chkLaunchNow.Checked;

            Thread worker = new Thread(() =>
            {
                try
                {
                    PerformInstall(targetDir, createShortcut, launchWhenDone);
                }
                catch (Exception ex)
                {
                    this.Invoke((MethodInvoker)delegate
                    {
                        MessageBox.Show("Installation Error: " + ex.Message, "Install Failed", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        btnInstall.Enabled = true;
                        btnInstall.Text = "Retry Install";
                        isInstalling = false;
                        btnCancel.Enabled = true;
                    });
                }
            });
            worker.IsBackground = true;
            worker.Start();
        }

        private void PerformInstall(string targetDir, bool createShortcut, bool launchWhenDone)
        {
            Directory.CreateDirectory(targetDir);

            Assembly assembly = Assembly.GetExecutingAssembly();
            Stream stream = assembly.GetManifestResourceStream("GamePackage.zip");

            if (stream == null)
            {
                // Fallback to local zip if embedded is missing during dev
                string localZip = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "TharFrontier1971_v1.0_Windows_x64.zip");
                if (File.Exists(localZip))
                {
                    stream = File.OpenRead(localZip);
                }
                else
                {
                    throw new FileNotFoundException("Could not find GamePackage.zip resource inside installer.");
                }
            }

            using (stream)
            using (ZipArchive archive = new ZipArchive(stream, ZipArchiveMode.Read))
            {
                int total = archive.Entries.Count;
                int current = 0;

                foreach (ZipArchiveEntry entry in archive.Entries)
                {
                    current++;
                    string entryPath = entry.FullName.Replace('\\', '/');

                    // Strip leading TharFrontier1971-win32-x64/ if present
                    if (entryPath.StartsWith("TharFrontier1971-win32-x64/"))
                    {
                        entryPath = entryPath.Substring("TharFrontier1971-win32-x64/".Length);
                    }

                    if (string.IsNullOrEmpty(entryPath)) continue;

                    string fullDestPath = Path.Combine(targetDir, entryPath.Replace('/', Path.DirectorySeparatorChar));

                    if (entry.FullName.EndsWith("/") || entry.FullName.EndsWith("\\"))
                    {
                        Directory.CreateDirectory(fullDestPath);
                    }
                    else
                    {
                        string dir = Path.GetDirectoryName(fullDestPath);
                        if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

                        entry.ExtractToFile(fullDestPath, true);
                    }

                    int percent = (int)((current / (float)total) * 100);
                    string fileName = Path.GetFileName(entryPath);

                    this.Invoke((MethodInvoker)delegate
                    {
                        progressBar.Value = Math.Min(100, percent);
                        lblStatus.Text = string.Format("Extracting ({0}%): {1}", percent, fileName);
                    });
                }
            }

            string exePath = Path.Combine(targetDir, "TharFrontier1971.exe");

            // Create Desktop Shortcut
            if (createShortcut && File.Exists(exePath))
            {
                this.Invoke((MethodInvoker)delegate
                {
                    lblStatus.Text = "Creating Desktop Shortcut...";
                });

                string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string shortcutFile = Path.Combine(desktop, "THAR FRONTIER 1971.lnk");
                CreateShortcutFile(shortcutFile, exePath, targetDir, "THAR FRONTIER: A Soldier's Promise · 1971 (23 Punjab Longewala)");

                // Also create Start Menu Shortcut
                string startMenu = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs");
                if (Directory.Exists(startMenu))
                {
                    string startShortcut = Path.Combine(startMenu, "THAR FRONTIER 1971.lnk");
                    CreateShortcutFile(startShortcut, exePath, targetDir, "THAR FRONTIER 1971");
                }
            }

            this.Invoke((MethodInvoker)delegate
            {
                progressBar.Value = 100;
                lblStatus.Text = "Installation Complete! Game is ready.";

                if (launchWhenDone && File.Exists(exePath))
                {
                    try
                    {
                        ProcessStartInfo psi = new ProcessStartInfo();
                        psi.FileName = exePath;
                        psi.WorkingDirectory = targetDir;
                        Process.Start(psi);
                    }
                    catch { }

                    Thread.Sleep(800);
                    this.Close();
                }
                else
                {
                    MessageBox.Show("THAR FRONTIER: A SOLDIER'S PROMISE · 1971 has been successfully installed!\n\nYou can launch it anytime from your Desktop.", "Install Complete", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    this.Close();
                }
            });
        }

        private static void CreateShortcutFile(string shortcutPath, string targetPath, string workingDir, string description)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType == null) return;

                object shell = Activator.CreateInstance(shellType);
                object shortcut = shellType.InvokeMember("CreateShortcut", BindingFlags.InvokeMethod, null, shell, new object[] { shortcutPath });

                Type scType = shortcut.GetType();
                scType.InvokeMember("TargetPath", BindingFlags.SetProperty, null, shortcut, new object[] { targetPath });
                scType.InvokeMember("WorkingDirectory", BindingFlags.SetProperty, null, shortcut, new object[] { workingDir });
                scType.InvokeMember("Description", BindingFlags.SetProperty, null, shortcut, new object[] { description });
                scType.InvokeMember("IconLocation", BindingFlags.SetProperty, null, shortcut, new object[] { targetPath + ",0" });
                scType.InvokeMember("Save", BindingFlags.InvokeMethod, null, shortcut, null);
            }
            catch { }
        }
    }
}

