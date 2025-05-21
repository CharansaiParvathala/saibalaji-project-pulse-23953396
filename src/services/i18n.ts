import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  common: {
    welcome: 'Welcome to Sai Balaji Construction',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    forgotPassword: 'Forgot Password',
    signInWithGoogle: 'Sign in with Google',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    role: 'Role',
    submit: 'Submit',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    projects: 'Projects',
    progress: 'Progress',
    payments: 'Payments',
    users: 'Users',
    vehicles: 'Vehicles',
    statistics: 'Statistics',
    settings: 'Settings',
    profile: 'Profile',
    dashboard: 'Dashboard',
    notifications: 'Notifications',
    search: 'Search',
    backup: 'Backup',
    loading: 'Loading...',
    errorOccurred: 'An error occurred',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    name: 'Name',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    noData: 'No data available',
    amount: 'Amount',
    description: 'Description',
    downloadReport: 'Download Report',
    exportData: 'Export Data',
    importData: 'Import Data',
    backups: 'Backups',
    shareLink: 'Share Link',
    enterOTP: 'Enter OTP',
    resetPassword: 'Reset Password',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    all: 'All',
    location: 'Location',
    hello: 'Hello',
    account: 'Account',
    menu: 'Menu',
    profileSettings: 'Profile Settings',
    essential: 'Essential',
    createProject: 'Create Project',
    addProgress: 'Add Progress',
    requestPayment: 'Request Payment',
    manageVehicles: 'Manage Vehicles',
    viewProjects: 'View Projects',
    trackProgress: 'Track Progress',
    manageUsers: 'Manage Users',
    viewStatistics: 'View Statistics',
    reviewSubmissions: 'Review Submissions',
    manageBackup: 'Manage Backup',
    downloadReports: 'Download Reports',
    manageBackupLinks: 'Manage Backup Links',
    exploreProjects: 'Explore Projects'
  },
  home: {
    quickAccess: 'Quick Access',
    exploreModules: 'Explore Modules',
    resources: 'Resources',
    documentation: 'Documentation & Reports',
    documentationDesc: 'Generate and download project reports in PDF or Word format for sharing with stakeholders.',
    statistics: 'Analytics & Statistics',
    statisticsDesc: 'View comprehensive analytics and visualizations of project performance, payments, and progress.',
    backupSharing: 'Backup & Data Sharing',
    backupDesc: 'Create backup links for secure data sharing with external team members.',
    footer: {
      description: 'Comprehensive construction management system for tracking projects, managing resources, and monitoring progress.',
      quickLinks: 'Quick Links',
      account: 'Account',
      copyright: 'Sai Balaji Construction. All rights reserved.'
    },
    banner: {
      title: 'Sai Balaji Construction Management',
      description: 'Empowering construction businesses with streamlined project management tools and insightful analytics.'
    },
    carousel: {
      management: 'Construction Management Made Simple',
      managementDesc: 'Track projects, manage payments, and monitor progress with our comprehensive construction management system.',
      tracking: 'Accurate Progress Tracking',
      trackingDesc: 'Monitor your construction projects in real-time with detailed progress tracking and reporting.',
      payments: 'Streamlined Payment Requests',
      paymentsDesc: 'Manage payment requests, approvals and track financial transactions with ease.'
    }
  },
  dashboard: {
    title: 'Dashboard',
    activeProjects: 'Active Projects',
    completedProjects: 'Completed Projects',
    pendingPayments: 'Pending Payments',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    viewAll: 'View All',
    projectSummary: 'Project Summary',
    paymentSummary: 'Payment Summary'
  },
  modules: {
    projects: {
      title: 'Projects Management',
      description: 'Create and manage construction projects, track progress and monitor resources.'
    },
    progress: {
      title: 'Progress Tracking',
      description: 'Record daily progress, document site activities and track completion rates.'
    },
    payments: {
      title: 'Payment Management',
      description: 'Manage payment requests, approvals and track financial transactions.'
    },
    vehicles: {
      title: 'Vehicle Management',
      description: 'Track vehicles, maintenance schedules and assign to projects.'
    },
    users: {
      title: 'User Management',
      description: 'Manage system users, roles and permissions for your organization.'
    },
    statistics: {
      title: 'Statistics & Reports',
      description: 'View analytical dashboards and generate reports on project performance.'
    },
    submissions: {
      title: 'Submissions Review',
      description: 'Review and approve submitted progress reports and payment requests.'
    },
    backup: {
      title: 'Backup & Data Security',
      description: 'Create backups, manage data sharing links and ensure data security.'
    }
  },
  projects: {
    createNew: 'Create New Project',
    projectName: 'Project Name',
    projectStatus: 'Project Status',
    createdBy: 'Created By',
    createdAt: 'Created At',
    totalDistance: 'Total Distance',
    numWorkers: 'Number of Workers',
    projectDetails: 'Project Details',
    progressEntries: 'Progress Entries',
    paymentRequests: 'Payment Requests',
    active: 'Active',
    completed: 'Completed',
    onHold: 'On Hold',
    planning: 'Planning',
    cancelled: 'Cancelled'
  },
  backup: {
    backupLinks: 'Backup Links',
    sharedBackupLinks: 'Shared Backup Links',
    addBackupLink: 'Add Backup Link',
    linkTitle: 'Link Title',
    linkURL: 'Link URL',
    linkDescription: 'Link Description (Optional)',
    confirmDeletion: 'Confirm Deletion',
    backupData: 'Backup Data',
    restoreData: 'Restore Data',
    noBackupLinks: 'No backup links found',
    linkAdded: 'Link Added',
    linkDeleted: 'Link Deleted',
    backupCreated: 'Backup Created',
    importData: 'Import Data',
    exportData: 'Export Data',
    downloadReport: 'Download Report',
    selectFormat: 'Select Format',
    generatePDF: 'Generate PDF',
    generateWord: 'Generate Word'
  }
};

// Telugu translations
const teTranslations = {
  common: {
    welcome: 'సాయి బాలాజీ కన్స్ట్రక్షన్‌కు స్వాగతం',
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    logout: 'లాగ్అవుట్',
    forgotPassword: 'పాస్వర్డ్ మర్చిపోయారా',
    signInWithGoogle: 'గూగుల్‌తో సైన్ ఇన్ చేయండి',
    email: 'ఇమెయిల్',
    password: 'పాస్వర్డ్',
    confirmPassword: 'పాస్వర్డ్ నిర్ధారించండి',
    fullName: 'పూర్తి పేరు',
    role: 'పాత్ర',
    submit: 'సమర్పించండి',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    delete: 'తొలగించు',
    edit: 'సవరించు',
    view: 'చూడండి',
    back: 'వెనుకకు',
    next: 'తదుపరి',
    previous: 'మునుపటి',
    projects: 'ప్రాజెక్టులు',
    progress: 'ప్రగతి',
    payments: 'చెల్లింపులు',
    users: 'వినియోగదారులు',
    vehicles: 'వాహనాలు',
    statistics: 'గణాంకాలు',
    settings: 'సెట్టింగులు',
    profile: 'ప్రొఫైల్',
    dashboard: 'డాష్‌బోర్డ్',
    notifications: 'నోటిఫికేషన్లు',
    search: 'శోధించండి',
    backup: 'బ్యాకప్',
    loading: 'లోడ్ అవుతోంది...',
    errorOccurred: 'ఒక లోపం సంభవించింది',
    success: 'విజయవంతం',
    error: 'లోపం',
    warning: 'హెచ్చరిక',
    info: 'సమాచారం',
    name: 'పేరు',
    status: 'స్థితి',
    date: 'తేదీ',
    actions: 'చర్యలు',
    noData: 'డేటా అందుబాటులో లేదు',
    amount: 'మొత్తం',
    description: 'వివరణ',
    downloadReport: 'నివేదికను డౌన్‌లోడ్ చేయండి',
    exportData: 'డేటాను ఎగుమతి చేయండి',
    importData: 'డేటాను దిగుమతి చేయండి',
    backups: 'బ్యాకప్‌లు',
    shareLink: 'లింక్‌ను షేర్ చేయండి',
    enterOTP: 'OTP నమోదు చేయండి',
    resetPassword: 'పాస్‌వర్డ్ రీసెట్ చేయండి',
    sendOTP: 'OTP పంపండి',
    verifyOTP: 'OTP ధృవీకరించండి',
    all: 'అన్నీ',
    location: 'ప్రదేశం',
    hello: 'హలో',
    account: 'ఖాతా',
    menu: 'మెను',
    profileSettings: 'ప్రొఫైల్ సెట్టింగ్‌లు',
    essential: 'ముఖ్యమైన',
    createProject: 'ప్రాజెక్ట్ సృష్టించు',
    addProgress: 'ప్రగతిని జోడించండి',
    requestPayment: 'చెల్లింపు అభ్యర్థన',
    manageVehicles: 'వాహనాలను నిర్వహించండి',
    viewProjects: 'ప్రాజెక్టులను వీక్షించండి',
    trackProgress: 'ప్రగతిని ట్రాక్ చేయండి',
    manageUsers: 'వినియోగదారులను నిర్వహించండి',
    viewStatistics: 'గణాంకాలను వీక్షించండి',
    reviewSubmissions: 'సమర్పణలను సమీక్షించండి',
    manageBackup: 'బ్యాకప్ నిర్వహించండి',
    downloadReports: 'నివేదికలను డౌన్‌లోడ్ చేయండి',
    manageBackupLinks: 'బ్యాకప్ లింక్‌లను నిర్వహించండి',
    exploreProjects: 'ప్రాజెక్టులను అన్వేషించండి'
  },
  home: {
    quickAccess: 'త్వరిత ప్రాప్తి',
    exploreModules: 'మాడ్యూల్స్ అన్వేషించండి',
    resources: 'వనరులు',
    documentation: 'పత్రీకరణ & నివేదికలు',
    documentationDesc: 'స్టేక్‌హోల్డర్‌లతో భాగస్వామ్యం చేయడానికి PDF లేదా Word ఫార్మాట్‌లో ప్రాజెక్ట్ నివేదికలను రూపొందించండి మరియు డౌన్‌లోడ్ చేయండి.',
    statistics: 'విశ్లేషణలు & గణాంకాలు',
    statisticsDesc: 'ప్రాజెక్ట్ పనితీరు, చెల్లింపులు మరియు పురోగతి యొక్క సమగ్ర విశ్లేషణలు మరియు విజువలైజేషన్‌లను వీక్షించండి.',
    backupSharing: 'బ్యాకప్ & డేటా షేరింగ్',
    backupDesc: 'బాహ్య టీమ్ సభ్యులతో సురక్షిత డేటా భాగస్వామ్యం కోసం బ్యాకప్ లింక్‌లను సృష్టించండి.',
    footer: {
      description: 'ప్రాజెక్టులను ట్రాక్ చేయడానికి, వనరులను నిర్వహించడానికి మరియు పురోగతిని పర్యవేక్షించడానికి సమగ్ర నిర్వహణ వ్యవస్థ.',
      quickLinks: 'త్వరిత లింకులు',
      account: 'ఖాతా',
      copyright: 'సాయి బాలాజీ కన్స్ట్రక్షన్. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.'
    },
    banner: {
      title: 'సాయి బాలాజీ నిర్మాణ నిర్వహణ',
      description: 'సరళీకృత ప్రాజెక్ట్ నిర్వహణ సాధనాలు మరియు అంతర్దృష్టి విశ్లేషణలతో నిర్మాణ వ్యాపారాలను శక్తివంతం చేస్తుంది.'
    },
    carousel: {
      management: 'నిర్మాణ నిర్వహణ సరళంగా చేయబడింది',
      managementDesc: 'మా సమగ్ర నిర్మాణ నిర్వహణ వ్యవస్థతో ప్రాజెక్ట్‌లను ట్రాక్ చేయండి, చెల్లింపులను నిర్వహించండి మరియు పురోగతిని పర్యవేక్షించండి.',
      tracking: 'ఖచ్చితమైన పురోగతి ట్రాకింగ్',
      trackingDesc: 'విస్తృత పురోగతి ట్రాకింగ్ మరియు నివేదికలతో మీ నిర్మాణ ప్రాజెక్ట్‌లను రియల్-టైమ్‌లో పర్యవేక్షించండి.',
      payments: 'సరళీకృత చెల్లింపు అభ్యర్థనలు',
      paymentsDesc: 'చెల్లింపు అభ్యర్థనలు, ఆమోదాలు మరియు ఆర్థిక లావాదేవీలను సులಭంగా ట్రాక్ చేయండి.'
    }
  },
  dashboard: {
    title: 'Dashboard',
    activeProjects: 'Active Projects',
    completedProjects: 'Completed Projects',
    pendingPayments: 'Pending Payments',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    viewAll: 'View All',
    projectSummary: 'Project Summary',
    paymentSummary: 'Payment Summary'
  },
  modules: {
    projects: {
      title: 'Projects Management',
      description: 'Create and manage construction projects, track progress and monitor resources.'
    },
    progress: {
      title: 'Progress Tracking',
      description: 'Record daily progress, document site activities and track completion rates.'
    },
    payments: {
      title: 'Payment Management',
      description: 'Manage payment requests, approvals and track financial transactions.'
    },
    vehicles: {
      title: 'Vehicle Management',
      description: 'Track vehicles, maintenance schedules and assign to projects.'
    },
    users: {
      title: 'User Management',
      description: 'Manage system users, roles and permissions for your organization.'
    },
    statistics: {
      title: 'Statistics & Reports',
      description: 'View analytical dashboards and generate reports on project performance.'
    },
    submissions: {
      title: 'Submissions Review',
      description: 'Review and approve submitted progress reports and payment requests.'
    },
    backup: {
      title: 'Backup & Data Security',
      description: 'Create backups, manage data sharing links and ensure data security.'
    }
  },
  projects: {
    createNew: 'Create New Project',
    projectName: 'Project Name',
    projectStatus: 'Project Status',
    createdBy: 'Created By',
    createdAt: 'Created At',
    totalDistance: 'Total Distance',
    numWorkers: 'Number of Workers',
    projectDetails: 'Project Details',
    progressEntries: 'Progress Entries',
    paymentRequests: 'Payment Requests',
    active: 'Active',
    completed: 'Completed',
    onHold: 'On Hold',
    planning: 'Planning',
    cancelled: 'Cancelled'
  },
  backup: {
    backupLinks: 'Backup Links',
    sharedBackupLinks: 'Shared Backup Links',
    addBackupLink: 'Add Backup Link',
    linkTitle: 'Link Title',
    linkURL: 'Link URL',
    linkDescription: 'Link Description (Optional)',
    confirmDeletion: 'Confirm Deletion',
    backupData: 'Backup Data',
    restoreData: 'Restore Data',
    noBackupLinks: 'No backup links found',
    linkAdded: 'Link Added',
    linkDeleted: 'Link Deleted',
    backupCreated: 'Backup Created',
    importData: 'Import Data',
    exportData: 'Export Data',
    downloadReport: 'Download Report',
    selectFormat: 'Select Format',
    generatePDF: 'Generate PDF',
    generateWord: 'Generate Word'
  }
};

// Kannada translations
const knTranslations = {
  common: {
    welcome: 'ಸಾಯಿ ಬಾಲಾಜಿ ಕನ್ಸ್ಟ್ರಕ್ಷನ್‌ಗೆ ಸುಸ್ವಾಗತ',
    login: 'ಲಾಗಿನ್',
    signup: 'ಸೈನ್ ಅಪ್',
    logout: 'ಲಾಗ್ಔಟ್',
    forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ',
    signInWithGoogle: 'ಗೂಗಲ್‌ನೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
    email: 'ಇಮೇಲ್',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    role: 'ಪಾತ್ರ',
    submit: 'ಸಲ್ಲಿಸು',
    save: 'ಉಳಿಸು',
    cancel: 'ರದ್ದುಮಾಡು',
    delete: 'ಅಳಿಸು',
    edit: 'ಸಂಪಾದಿಸು',
    view: 'ವೀಕ್ಷಿಸು',
    back: 'ಹಿಂದೆ',
    next: 'ಮುಂದೆ',
    previous: 'ಹಿಂದಿನ',
    projects: 'ಯೋಜನೆಗಳು',
    progress: 'ಪ್ರಗತಿ',
    payments: 'ಪಾವತಿಗಳು',
    users: 'ಬಳಕೆದಾರರು',
    vehicles: 'ವಾಹನಗಳು',
    statistics: 'ಅಂಕಿಅಂಶಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    search: 'ಹುಡುಕು',
    backup: 'ಬ್ಯಾಕಪ್',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    errorOccurred: 'ದೋಷ ಸಂಭವಿಸಿದೆ',
    success: 'ಯಶಸ್ಸು',
    error: 'ದೋಷ',
    warning: 'ಎಚ್ಚರಿಕೆ',
    info: 'ಮಾಹಿತಿ',
    name: 'ಹೆಸರು',
    status: 'ಸ್ಥಿತಿ',
    date: 'ದಿನಾಂಕ',
    actions: 'ಕ್ರಿಯೆಗಳು',
    noData: 'ಯಾವುದೇ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ',
    amount: 'ಮೊತ್ತ',
    description: 'ವಿವರಣೆ',
    downloadReport: 'ವರದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    exportData: 'ಡೇಟಾವನ್ನು ರಫ್ತು ಮಾಡಿ',
    importData: 'ಡೇಟಾವನ್ನು ಆಮದು ಮಾಡಿ',
    backups: 'ಬ್ಯಾಕಪ್‌ಗಳು',
    shareLink: 'ಲಿಂಕ್ ಹಂಚಿಕೊಳ್ಳಿ',
    enterOTP: 'OTP ನಮೂದಿಸಿ',
    resetPassword: 'ಪಾಸ್‌ವರ್ड್ ಮರುಹೊಂದಿಸಿ',
    sendOTP: 'OTP ಕಳುಹಿಸಿ',
    verifyOTP: 'OTP ಪರಿಶೀಲಿಸಿ',
    all: 'ಎಲ್ಲಾ',
    location: 'ಸ್ಥಳ',
    hello: 'ನಮಸ್ಕಾರ',
    account: 'ಖಾತೆ',
    menu: 'ಮೆನು',
    profileSettings: 'ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    essential: 'ಅತ್ಯಗತ್ಯ',
    createProject: 'ಯೋಜನೆಯನ್ನು ರಚಿಸಿ',
    addProgress: 'ಪ್ರಗತಿ ಸೇರಿಸಿ',
    requestPayment: 'ಪಾವತಿ ವಿನಂತಿಸಿ',
    manageVehicles: 'ವಾಹನಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    viewProjects: 'ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    trackProgress: 'ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    manageUsers: 'ಬಳಕೆದಾರರನ್ನು ನಿರ್ವಹಿಸಿ',
    viewStatistics: 'ಅಂಕಿಅಂಶಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    reviewSubmissions: 'ಸಲ್ಲಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    manageBackup: 'ಬ್ಯಾಕಪ್ ನಿರ್ವಹಿಸಿ',
    downloadReports: 'ವರದಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    manageBackupLinks: 'ಬ್ಯಾಕಪ್ ಲಿಂಕ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    exploreProjects: 'ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ'
  },
  home: {
    quickAccess: 'ತ್ವರಿತ ಪ್ರವೇಶ',
    exploreModules: 'ಮಾಡ್ಯೂಲ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    resources: 'ಸಂಪನ್ಮೂಲಗಳು',
    documentation: 'ದಾಖಲೀಕರಣ & ವರದಿಗಳು',
    documentationDesc: 'ಪಾಲುದಾರರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು PDF ಅಥವಾ Word ಫಾರ್ಮ್ಯಾಟ್‌ನಲ್ಲಿ ಯೋಜನೆ ವರದಿಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
    statistics: 'ವಿಶ್ಲೇಷಣೆಗಳು & ಅಂಕಿಅಂಶಗಳು',
    statisticsDesc: 'ಯೋಜನೆಯ ಕಾರ್ಯಕ್ಷಮತೆ, ಪಾವತಿಗಳು ಮತ್ತು ಪ್ರಗತಿಯ ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆಗಳು ಮತ್ತು ದೃಶ್ಯೀಕರಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ.',
    backupSharing: 'ಬ್ಯಾಕಪ್ & ಡೇಟಾ ಹಂಚಿಕೆ',
    backupDesc: 'ಬಾಹ್ಯ ತಂಡದ ಸದಸ್ಯರೊಂದಿಗೆ ಸುರಕ್ಷಿತ ಡೇಟಾ ಹಂಚಿಕೆಗಾಗಿ ಬ್ಯಾಕಪ್ ಲಿಂಕ್‌ಗಳನ್ನು ರಚಿಸಿ.',
    footer: {
      description: 'ಯೋಜನೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುವ, ಸಂಪನ್ಮೂಲಗಳನ್ನು ನಿರ್ವಹಿಸುವ ಮತ್ತು ಪ್ರಗತಿಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುವ ಸಮಗ್ರ ನಿರ್ಮಾಣ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ.',
      quickLinks: 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು',
      account: 'ಖಾತೆ',
      copyright: 'ಸಾಯಿ ಬಾಲಾಜಿ ಕನ್ಸ್ಟ್ರಕ್ಷನ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.'
    },
    banner: {
      title: 'ಸಾಯಿ ಬಾಲಾಜಿ ನಿರ್ಮಾಣ ನಿರ್ವಹಣೆ',
      description: 'ಸುಗಮಗೊಳಿಸಿದ ಯೋಜನೆ ನಿರ್ವಹಣಾ ಪರಿಕರಗಳು ಮತ್ತು ಒಳನೋಟದ ವಿಶ್ಲೇಷಣೆಗಳೊಂದಿಗೆ ನಿರ್ಮಾಣ ವ್ಯವಹಾರಗಳನ್ನು ಸಬಲಗೊಳಿಸುವುದು.'
    },
    carousel: {
      management: 'ನಿರ್ಮಾಣ ನಿರ್ವಹಣೆಯನ್ನು ಸರಳಗೊಳಿಸಲಾಗಿದೆ',
      managementDesc: 'ನಮ್ಮ ಸಮಗ್ರ ನಿರ್ಮಾಣ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆಯೊಂದಿಗೆ ಯೋಜನೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ಪಾವತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಪ್ರಗತಿಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.',
      tracking: 'ನಿಖರವಾದ ಪ್ರಗತಿ ಟ್ರ್ಯಾಕಿಂಗ್',
      trackingDesc: 'ವಿವರವಾದ ಪ್ರಗತಿ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ವರದಿಯೊಂದಿಗೆ ನಿಮ್ಮ ನಿರ್ಮಾಣ ಯೋಜನೆಗಳನ್ನು ರಿಯಲ್-ಟೈಮ್‌ನಲ್ಲಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.',
      payments: 'ಸುಗಮಗೊಳಿಸಿದ ಪಾವತಿ ವಿನಂತಿಗಳು',
      paymentsDesc: 'ಪಾವತಿ ವಿನಂತಿಗಳು, ಅನುಮೋದನೆಗಳು ಮತ್ತು ಹಣಕಾಸು ವಹಿವಾಟುಗಳನ್ನು ಸುಲಭವಾಗಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.'
    }
  },
  dashboard: {
    title: 'Dashboard',
    activeProjects: 'Active Projects',
    completedProjects: 'Completed Projects',
    pendingPayments: 'Pending Payments',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    viewAll: 'View All',
    projectSummary: 'Project Summary',
    paymentSummary: 'Payment Summary'
  },
  modules: {
    projects: {
      title: 'Projects Management',
      description: 'Create and manage construction projects, track progress and monitor resources.'
    },
    progress: {
      title: 'Progress Tracking',
      description: 'Record daily progress, document site activities and track completion rates.'
    },
    payments: {
      title: 'Payment Management',
      description: 'Manage payment requests, approvals and track financial transactions.'
    },
    vehicles: {
      title: 'Vehicle Management',
      description: 'Track vehicles, maintenance schedules and assign to projects.'
    },
    users: {
      title: 'User Management',
      description: 'Manage system users, roles and permissions for your organization.'
    },
    statistics: {
      title: 'Statistics & Reports',
      description: 'View analytical dashboards and generate reports on project performance.'
    },
    submissions: {
      title: 'Submissions Review',
      description: 'Review and approve submitted progress reports and payment requests.'
    },
    backup: {
      title: 'Backup & Data Security',
      description: 'Create backups, manage data sharing links and ensure data security.'
    }
  },
  projects: {
    createNew: 'Create New Project',
    projectName: 'Project Name',
    projectStatus: 'Project Status',
    createdBy: 'Created By',
    createdAt: 'Created At',
    totalDistance: 'Total Distance',
    numWorkers: 'Number of Workers',
    projectDetails: 'Project Details',
    progressEntries: 'Progress Entries',
    paymentRequests: 'Payment Requests',
    active: 'Active',
    completed: 'Completed',
    onHold: 'On Hold',
    planning: 'Planning',
    cancelled: 'Cancelled'
  },
  backup: {
    backupLinks: 'Backup Links',
    sharedBackupLinks: 'Shared Backup Links',
    addBackupLink: 'Add Backup Link',
    linkTitle: 'Link Title',
    linkURL: 'Link URL',
    linkDescription: 'Link Description (Optional)',
    confirmDeletion: 'Confirm Deletion',
    backupData: 'Backup Data',
    restoreData: 'Restore Data',
    noBackupLinks: 'No backup links found',
    linkAdded: 'Link Added',
    linkDeleted: 'Link Deleted',
    backupCreated: 'Backup Created',
    importData: 'Import Data',
    exportData: 'Export Data',
    downloadReport: 'Download Report',
    selectFormat: 'Select Format',
    generatePDF: 'Generate PDF',
    generateWord: 'Generate Word'
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: enTranslations,
      te: teTranslations,
      kn: knTranslations
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
