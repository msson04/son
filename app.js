// Enhanced Productivity Dashboard App with TODO-Calendar Integration
class ProductivityDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.isDarkTheme = localStorage.getItem('darkTheme') === 'true';
        this.nextId = this.generateNextId();
        this.currentMonth = new Date(2025, 6, 1); // July 2025
        this.selectedEventForConversion = null;

        // Initialize data structures
        this.initializeData();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    initializeData() {
        // Load data from localStorage or use sample data
        this.todos = this.loadFromStorage('todos') || [
            {
                id: 1,
                text: "웹사이트 디자인 완성하기",
                priority: "high",
                completed: false,
                dueDate: "2025-07-05",
                category: "개발",
                createdAt: "2025-07-02"
            },
            {
                id: 2,
                text: "프로젝트 문서 작성",
                priority: "medium",
                completed: true,
                dueDate: "2025-07-03",
                category: "업무",
                createdAt: "2025-07-01"
            },
            {
                id: 3,
                text: "새로운 기술 스택 학습",
                priority: "low",
                completed: false,
                dueDate: "2025-07-10",
                category: "학습",
                createdAt: "2025-07-02"
            }
        ];

        this.goals = this.loadFromStorage('goals') || [
            {
                id: 1,
                title: "웹 개발 실력 향상",
                progress: 75,
                category: "개발"
            },
            {
                id: 2,
                title: "개인 프로젝트 완성",
                progress: 40,
                category: "프로젝트"
            }
        ];

        this.events = this.loadFromStorage('events') || [
            {
                id: 1,
                title: "팀 미팅",
                date: "2025-07-03",
                time: "10:00",
                category: "업무",
                isActionable: true
            },
            {
                id: 2,
                title: "프로젝트 마감",
                date: "2025-07-10",
                time: "23:59",
                category: "업무",
                isActionable: false
            },
            {
                id: 3,
                title: "개발 컨퍼런스",
                date: "2025-07-15",
                time: "09:00",
                category: "학습",
                isActionable: true
            }
        ];

        this.notes = this.loadFromStorage('notes') || [
            {
                id: 1,
                title: "JavaScript 학습 노트",
                content: "ES6 문법 정리 및 활용 방법\n- 화살표 함수\n- 구조 분해 할당\n- 템플릿 리터럴",
                category: "개발",
                tags: ["JavaScript", "ES6", "학습"],
                createdAt: "2025-07-01",
                updatedAt: "2025-07-01"
            },
            {
                id: 2,
                title: "UI/UX 디자인 아이디어",
                content: "사용자 친화적인 인터페이스 설계 방법\n- 직관적인 네비게이션\n- 일관된 컬러 팔레트\n- 접근성 고려",
                category: "디자인",
                tags: ["UI", "UX", "디자인"],
                createdAt: "2025-07-02",
                updatedAt: "2025-07-02"
            }
        ];

        this.projects = this.loadFromStorage('projects') || [
            {
                id: 1,
                name: "개인 포트폴리오 웹사이트",
                description: "React를 사용한 반응형 포트폴리오 제작",
                progress: 60,
                status: "진행중",
                startDate: "2025-06-01",
                endDate: "2025-07-15",
                category: "개발"
            },
            {
                id: 2,
                name: "생산성 앱 개발",
                description: "HTML/CSS/JS로 구현한 생산성 도구",
                progress: 100,
                status: "완료",
                startDate: "2025-05-01",
                endDate: "2025-06-30",
                category: "개발"
            }
        ];

        this.journals = this.loadFromStorage('journals') || [
            {
                id: 1,
                title: "오늘의 학습 기록",
                content: "웹 개발 관련 새로운 기술을 배웠다. 특히 LocalStorage 활용법이 인상적이었다.",
                mood: "productive",
                date: "2025-07-02",
                tags: ["학습", "개발", "성장"]
            },
            {
                id: 2,
                title: "프로젝트 회고",
                content: "이번 프로젝트를 통해 많은 것을 배웠다. 특히 사용자 경험의 중요성을 깨달았다.",
                mood: "reflective",
                date: "2025-07-01",
                tags: ["회고", "프로젝트", "성장"]
            }
        ];

        this.portfolio = this.loadFromStorage('portfolio') || {
            name: "홍길동",
            title: "웹 개발자",
            email: "hong@email.com",
            phone: "010-1234-5678",
            location: "서울, 대한민국",
            summary: "사용자 중심의 웹 애플리케이션을 개발하는 것을 좋아하는 개발자입니다.",
            skills: ["JavaScript", "React", "Node.js", "Python", "HTML/CSS", "Git"],
            projects: ["포트폴리오 웹사이트", "생산성 앱", "쇼핑몰 프로젝트"],
            experience: [
                {
                    company: "테크 회사",
                    position: "프론트엔드 개발자",
                    period: "2023-현재",
                    description: "React 기반 웹 애플리케이션 개발"
                }
            ]
        };
    }

    generateNextId() {
        const allIds = [
            ...this.loadFromStorage('todos')?.map(t => t.id) || [],
            ...this.loadFromStorage('goals')?.map(g => g.id) || [],
            ...this.loadFromStorage('events')?.map(e => e.id) || [],
            ...this.loadFromStorage('notes')?.map(n => n.id) || [],
            ...this.loadFromStorage('projects')?.map(p => p.id) || [],
            ...this.loadFromStorage('journals')?.map(j => j.id) || []
        ];
        return Math.max(...allIds, 1000) + 1;
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.applyTheme();
        this.setDefaultDates(); // Set default dates for inputs
        this.renderAll();
        this.updateDashboard();
        this.showMessage('앱이 성공적으로 로드되었습니다!', 'success');
    }

    setDefaultDates() {
        // Set default dates for date inputs
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Set default for todo due date (tomorrow)
        const todoDueDate = document.getElementById('todoDueDate');
        if (todoDueDate && !todoDueDate.value) {
            todoDueDate.value = tomorrow;
        }
        
        // Set default for event date (today)
        const eventDate = document.getElementById('eventDate');
        if (eventDate && !eventDate.value) {
            eventDate.value = today;
        }
        
        // Set default for event time (current time + 1 hour)
        const eventTime = document.getElementById('eventTime');
        if (eventTime && !eventTime.value) {
            const now = new Date();
            now.setHours(now.getHours() + 1);
            eventTime.value = now.toTimeString().slice(0, 5);
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Sync button
        const syncBtn = document.getElementById('syncBtn');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => {
                this.syncData();
            });
        }

        // Form submissions
        this.setupFormEventListeners();

        // Search functionality
        const noteSearch = document.getElementById('noteSearch');
        if (noteSearch) {
            noteSearch.addEventListener('input', (e) => {
                this.searchNotes(e.target.value);
            });
        }

        // Calendar navigation
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        if (prevMonth) prevMonth.addEventListener('click', () => this.changeMonth(-1));
        if (nextMonth) nextMonth.addEventListener('click', () => this.changeMonth(1));

        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.exportToExcel(type);
            });
        });

        // Data management buttons
        this.setupDataManagementListeners();

        // Modal event listeners
        this.setupModalEventListeners();

        // Touch events for mobile
        this.setupTouchEvents();
    }

    setupFormEventListeners() {
        // Todo form
        const todoForm = document.querySelector('.todo-form');
        if (todoForm) {
            todoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTodo();
            });
        }

        // Goal form
        const goalForm = document.querySelector('.goal-form');
        if (goalForm) {
            goalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addGoal();
            });
        }

        // Event form
        const eventForm = document.querySelector('.event-form');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addEvent();
            });
        }

        // Note form
        const noteForm = document.querySelector('.note-form');
        if (noteForm) {
            noteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNote();
            });
        }

        // Project form
        const projectForm = document.querySelector('.project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProject();
            });
        }

        // Journal form
        const journalForm = document.querySelector('.journal-form');
        if (journalForm) {
            journalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addJournal();
            });
        }
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const nav = document.getElementById('mainNav');
        
        if (mobileMenuToggle && nav) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                mobileMenuToggle.classList.toggle('active');
                nav.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking nav items
            nav.querySelectorAll('.nav-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    mobileMenuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }

    setupDataManagementListeners() {
        const exportBackup = document.getElementById('exportBackup');
        const importBackupBtn = document.getElementById('importBackupBtn');
        const importBackup = document.getElementById('importBackup');
        const clearData = document.getElementById('clearData');

        if (exportBackup) {
            exportBackup.addEventListener('click', () => this.exportBackup());
        }

        if (importBackupBtn && importBackup) {
            importBackupBtn.addEventListener('click', () => importBackup.click());
            importBackup.addEventListener('change', (e) => this.importBackup(e));
        }

        if (clearData) {
            clearData.addEventListener('click', () => this.clearAllData());
        }
    }

    setupModalEventListeners() {
        const modal = document.getElementById('eventToTodoModal');
        const closeModal = document.getElementById('closeModal');
        const cancelConvert = document.getElementById('cancelConvert');
        const confirmConvert = document.getElementById('confirmConvert');

        if (closeModal) closeModal.addEventListener('click', () => this.closeModal());
        if (cancelConvert) cancelConvert.addEventListener('click', () => this.closeModal());
        if (confirmConvert) confirmConvert.addEventListener('click', () => this.convertEventToTodo());
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }
    }

    setupTouchEvents() {
        // Basic swipe support for mobile
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                // Swipe left/right to navigate sections (basic implementation)
                // This could be enhanced with proper section cycling
            }

            startX = 0;
            startY = 0;
        });
    }

    // Storage management
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            this.showMessage('데이터 저장에 실패했습니다.', 'error');
            return false;
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return null;
        }
    }

    syncData() {
        const syncBtn = document.getElementById('syncBtn');
        if (syncBtn) {
            syncBtn.classList.add('syncing');
        }

        // Save all data to localStorage
        const savePromises = [
            this.saveToStorage('todos', this.todos),
            this.saveToStorage('goals', this.goals),
            this.saveToStorage('events', this.events),
            this.saveToStorage('notes', this.notes),
            this.saveToStorage('projects', this.projects),
            this.saveToStorage('journals', this.journals),
            this.saveToStorage('portfolio', this.portfolio)
        ];

        setTimeout(() => {
            if (syncBtn) {
                syncBtn.classList.remove('syncing');
            }
            this.showMessage('데이터가 성공적으로 동기화되었습니다!', 'success');
            this.updateStorageStats();
        }, 1000);
    }

    updateStorageStats() {
        const storageStats = document.getElementById('storageStats');
        if (!storageStats) return;

        const stats = {
            'todos': this.todos.length,
            'goals': this.goals.length,
            'events': this.events.length,
            'notes': this.notes.length,
            'projects': this.projects.length,
            'journals': this.journals.length
        };

        storageStats.innerHTML = Object.entries(stats)
            .map(([key, count]) => `
                <div class="storage-stat">
                    <span>${this.getKoreanLabel(key)}</span>
                    <span>${count}개</span>
                </div>
            `).join('');
    }

    getKoreanLabel(key) {
        const labels = {
            todos: '할 일',
            goals: '목표',
            events: '일정',
            notes: '노트',
            projects: '프로젝트',
            journals: '일기'
        };
        return labels[key] || key;
    }

    // Theme management
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.saveToStorage('darkTheme', this.isDarkTheme);
        this.applyTheme();
        this.showMessage(`${this.isDarkTheme ? '다크' : '라이트'} 테마로 변경되었습니다.`, 'success');
    }

    applyTheme() {
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = this.isDarkTheme ? '☀️' : '🌙';
        }
    }

    // Navigation
    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-section="${section}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        const activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        this.currentSection = section;
        this.renderCurrentSection();
    }

    renderCurrentSection() {
        switch(this.currentSection) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'todos':
                this.renderTodos();
                this.renderGoals();
                break;
            case 'calendar':
                this.renderEvents();
                this.renderCalendar();
                break;
            case 'notes':
                this.renderNotes();
                break;
            case 'projects':
                this.renderProjects();
                break;
            case 'journal':
                this.renderJournals();
                break;
            case 'portfolio':
                this.loadPortfolio();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'export':
                this.updateStorageStats();
                break;
        }
    }

    renderAll() {
        this.renderTodos();
        this.renderGoals();
        this.renderEvents();
        this.renderCalendar();
        this.renderNotes();
        this.renderProjects();
        this.renderJournals();
        this.renderAnalytics();
        this.loadPortfolio();
        this.updateStorageStats();
    }

    // Dashboard functionality
    updateDashboard() {
        this.updateDashboardStats();
        this.renderTodayTodos();
        this.renderUpcomingEvents();
    }

    updateDashboardStats() {
        const today = new Date().toISOString().split('T')[0];
        const totalTodos = this.todos.length;
        const completedTodos = this.todos.filter(t => t.completed).length;
        const todayEvents = this.events.filter(e => e.date === today).length;
        const activeProjects = this.projects.filter(p => p.progress < 100).length;

        this.updateElement('dashTotalTodos', totalTodos);
        this.updateElement('dashCompletedTodos', completedTodos);
        this.updateElement('dashTodayEvents', todayEvents);
        this.updateElement('dashActiveProjects', activeProjects);
    }

    renderTodayTodos() {
        const container = document.getElementById('todayTodos');
        if (!container) return;

        const today = new Date().toISOString().split('T')[0];
        const todayTodos = this.todos.filter(t => !t.completed && (t.dueDate === today || !t.dueDate));

        container.innerHTML = '';
        
        todayTodos.slice(0, 5).forEach(todo => {
            const todoEl = document.createElement('div');
            todoEl.className = 'todo-item';
            todoEl.innerHTML = `
                <div class="todo-checkbox" onclick="app.toggleTodo(${todo.id})"></div>
                <div class="todo-text">${todo.text}</div>
                <div class="priority-badge priority-${todo.priority}">
                    ${this.getPriorityLabel(todo.priority)}
                </div>
            `;
            container.appendChild(todoEl);
        });
    }

    renderUpcomingEvents() {
        const container = document.getElementById('upcomingEvents');
        if (!container) return;

        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const upcomingEvents = this.events
            .filter(e => {
                const eventDate = new Date(e.date);
                return eventDate >= today && eventDate <= nextWeek;
            })
            .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
            .slice(0, 5);

        container.innerHTML = '';
        
        upcomingEvents.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = `event-item ${event.isActionable ? 'actionable' : ''}`;
            eventEl.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-datetime">${this.formatDate(event.date)} ${event.time}</div>
                <div class="event-category">${event.category}</div>
            `;
            
            if (event.isActionable) {
                eventEl.addEventListener('click', () => this.showEventToTodoModal(event));
            }
            
            container.appendChild(eventEl);
        });
    }

    // Todo Management
    addTodo() {
        const todoText = document.getElementById('todoText');
        const todoPriority = document.getElementById('todoPriority');
        const todoDueDate = document.getElementById('todoDueDate');
        const todoCategory = document.getElementById('todoCategory');

        if (!todoText || !todoPriority || !todoCategory) return;

        const text = todoText.value.trim();
        const priority = todoPriority.value;
        const dueDate = todoDueDate.value;
        const category = todoCategory.value;

        if (!text) {
            this.showMessage('할 일 내용을 입력해주세요.', 'error');
            return;
        }

        const newTodo = {
            id: this.nextId++,
            text,
            priority,
            completed: false,
            dueDate: dueDate || null,
            category,
            createdAt: new Date().toISOString().split('T')[0]
        };

        this.todos.push(newTodo);
        this.saveToStorage('todos', this.todos);
        
        // Clear form
        todoText.value = '';
        // Reset due date to tomorrow
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        todoDueDate.value = tomorrow;
        
        this.renderTodos();
        this.renderCalendar(); // Update calendar to show new todo
        this.updateDashboard();
        this.showMessage('할 일이 추가되었습니다!', 'success');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage('todos', this.todos);
            this.renderTodos();
            this.renderCalendar(); // Update calendar
            this.updateDashboard();
            this.showMessage(todo.completed ? '할 일을 완료했습니다!' : '할 일을 미완료로 변경했습니다.', 'success');
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToStorage('todos', this.todos);
        this.renderTodos();
        this.renderCalendar();
        this.updateDashboard();
        this.showMessage('할 일이 삭제되었습니다.', 'success');
    }

    renderTodos() {
        const container = document.getElementById('todoList');
        if (!container) return;

        container.innerHTML = '';
        
        const sortedTodos = [...this.todos].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            if (a.priority !== b.priority) {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        });

        sortedTodos.forEach(todo => {
            const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
            const isDueToday = todo.dueDate === new Date().toISOString().split('T')[0];
            
            const todoEl = document.createElement('div');
            todoEl.className = `todo-item ${todo.completed ? 'completed' : ''} ${isDueToday ? 'due-today' : ''} ${isOverdue ? 'overdue' : ''}`;
            todoEl.innerHTML = `
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="app.toggleTodo(${todo.id})">
                    ${todo.completed ? '✓' : ''}
                </div>
                <div class="todo-text">${todo.text}</div>
                <div class="todo-meta">
                    <div class="priority-badge priority-${todo.priority}">
                        ${this.getPriorityLabel(todo.priority)}
                    </div>
                    ${todo.dueDate ? `<div class="todo-due-date">${this.formatDate(todo.dueDate)}</div>` : ''}
                </div>
                <button class="btn btn--sm btn--outline" onclick="app.deleteTodo(${todo.id})" style="margin-left: auto;">삭제</button>
            `;
            container.appendChild(todoEl);
        });
    }

    getPriorityLabel(priority) {
        const labels = { high: '높음', medium: '보통', low: '낮음' };
        return labels[priority] || priority;
    }

    // Goal Management
    addGoal() {
        const goalTitle = document.getElementById('goalTitle');
        const goalCategory = document.getElementById('goalCategory');
        
        if (!goalTitle || !goalCategory) return;

        const title = goalTitle.value.trim();
        const category = goalCategory.value;
        
        if (!title) {
            this.showMessage('목표 제목을 입력해주세요.', 'error');
            return;
        }

        const newGoal = {
            id: this.nextId++,
            title,
            progress: 0,
            category
        };

        this.goals.push(newGoal);
        this.saveToStorage('goals', this.goals);
        
        goalTitle.value = '';
        this.renderGoals();
        this.showMessage('목표가 추가되었습니다!', 'success');
    }

    updateGoalProgress(id, progress) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            goal.progress = Math.max(0, Math.min(100, progress));
            this.saveToStorage('goals', this.goals);
            this.renderGoals();
        }
    }

    renderGoals() {
        const container = document.getElementById('goalsList');
        if (!container) return;

        container.innerHTML = '';

        this.goals.forEach(goal => {
            const goalEl = document.createElement('div');
            goalEl.className = 'goal-item';
            goalEl.innerHTML = `
                <div class="goal-title">${goal.title}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${goal.progress}%"></div>
                </div>
                <div class="goal-progress">${goal.progress}% 완료</div>
                <div style="margin-top: 8px; display: flex; gap: 8px;">
                    <button class="btn btn--secondary btn--sm" onclick="app.updateGoalProgress(${goal.id}, ${goal.progress + 10})">+10%</button>
                    <button class="btn btn--secondary btn--sm" onclick="app.updateGoalProgress(${goal.id}, ${goal.progress - 10})">-10%</button>
                </div>
            `;
            container.appendChild(goalEl);
        });
    }

    // Event Management
    addEvent() {
        const eventTitle = document.getElementById('eventTitle');
        const eventDate = document.getElementById('eventDate');
        const eventTime = document.getElementById('eventTime');
        const eventCategory = document.getElementById('eventCategory');
        const eventIsActionable = document.getElementById('eventIsActionable');

        if (!eventTitle || !eventDate || !eventTime || !eventCategory) return;

        const title = eventTitle.value.trim();
        const date = eventDate.value;
        const time = eventTime.value;
        const category = eventCategory.value;
        const isActionable = eventIsActionable.checked;

        if (!title || !date || !time) {
            this.showMessage('모든 필수 항목을 입력해주세요.', 'error');
            return;
        }

        const newEvent = {
            id: this.nextId++,
            title,
            date,
            time,
            category,
            isActionable
        };

        this.events.push(newEvent);
        this.saveToStorage('events', this.events);
        
        // Clear form
        eventTitle.value = '';
        const today = new Date().toISOString().split('T')[0];
        eventDate.value = today;
        const now = new Date();
        now.setHours(now.getHours() + 1);
        eventTime.value = now.toTimeString().slice(0, 5);
        eventIsActionable.checked = false;
        
        this.renderEvents();
        this.renderCalendar();
        this.updateDashboard();
        this.showMessage('일정이 추가되었습니다!', 'success');
    }

    renderEvents() {
        const container = document.getElementById('eventsList');
        if (!container) return;

        container.innerHTML = '';

        const sortedEvents = [...this.events].sort((a, b) => 
            new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
        );

        sortedEvents.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = `event-item ${event.isActionable ? 'actionable' : ''}`;
            eventEl.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-datetime">${this.formatDate(event.date)} ${event.time}</div>
                <div class="event-category">${event.category}</div>
            `;
            
            if (event.isActionable) {
                eventEl.addEventListener('click', () => this.showEventToTodoModal(event));
                eventEl.style.cursor = 'pointer';
                eventEl.title = '클릭하여 할 일로 변환';
            }
            
            container.appendChild(eventEl);
        });
    }

    changeMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.renderCalendar();
        this.updateCurrentMonthDisplay();
    }

    updateCurrentMonthDisplay() {
        const currentMonthEl = document.getElementById('currentMonth');
        if (currentMonthEl) {
            const year = this.currentMonth.getFullYear();
            const month = this.currentMonth.getMonth() + 1;
            currentMonthEl.textContent = `${year}년 ${month}월`;
        }
    }

    renderCalendar() {
        const container = document.getElementById('calendarGrid');
        if (!container) return;

        container.innerHTML = '';

        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        // Add day headers
        const dayHeaders = ['일', '월', '화', '수', '목', '금', '토'];
        dayHeaders.forEach(day => {
            const headerEl = document.createElement('div');
            headerEl.style.textAlign = 'center';
            headerEl.style.fontWeight = 'bold';
            headerEl.style.color = 'rgba(255, 255, 255, 0.8)';
            headerEl.style.padding = '8px';
            headerEl.textContent = day;
            container.appendChild(headerEl);
        });

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyEl = document.createElement('div');
            container.appendChild(emptyEl);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Check for events and todos
            const hasEvent = this.events.some(event => event.date === dateStr);
            const hasTodo = this.todos.some(todo => todo.dueDate === dateStr && !todo.completed);
            
            if (hasEvent && hasTodo) {
                dayEl.classList.add('has-both');
                dayEl.title = 'TODO와 일정이 있습니다';
            } else if (hasEvent) {
                dayEl.classList.add('has-event');
                dayEl.title = '일정이 있습니다';
            } else if (hasTodo) {
                dayEl.classList.add('has-todo');
                dayEl.title = 'TODO가 있습니다';
            }

            // Mark today
            const today = new Date().toISOString().split('T')[0];
            if (dateStr === today) {
                dayEl.classList.add('today');
            }

            container.appendChild(dayEl);
        }

        this.updateCurrentMonthDisplay();
    }

    // Event to Todo conversion
    showEventToTodoModal(event) {
        this.selectedEventForConversion = event;
        const modal = document.getElementById('eventToTodoModal');
        const modalEventInfo = document.getElementById('modalEventInfo');
        
        if (modal && modalEventInfo) {
            modalEventInfo.innerHTML = `
                <p><strong>제목:</strong> ${event.title}</p>
                <p><strong>날짜:</strong> ${this.formatDate(event.date)} ${event.time}</p>
                <p><strong>카테고리:</strong> ${event.category}</p>
            `;
            modal.classList.add('active');
        }
    }

    closeModal() {
        const modal = document.getElementById('eventToTodoModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.selectedEventForConversion = null;
    }

    convertEventToTodo() {
        if (!this.selectedEventForConversion) return;

        const event = this.selectedEventForConversion;
        const newTodo = {
            id: this.nextId++,
            text: event.title,
            priority: 'medium',
            completed: false,
            dueDate: event.date,
            category: event.category,
            createdAt: new Date().toISOString().split('T')[0]
        };

        this.todos.push(newTodo);
        this.saveToStorage('todos', this.todos);
        
        this.renderTodos();
        this.renderCalendar();
        this.updateDashboard();
        this.closeModal();
        this.showMessage('일정이 할 일로 변환되었습니다!', 'success');
    }

    // Note Management
    addNote() {
        const noteTitle = document.getElementById('noteTitle');
        const noteContent = document.getElementById('noteContent');
        const noteCategory = document.getElementById('noteCategory');
        const noteTags = document.getElementById('noteTags');

        if (!noteTitle || !noteContent || !noteCategory) return;

        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        const category = noteCategory.value;
        const tags = noteTags.value.split(',').map(tag => tag.trim()).filter(tag => tag);

        if (!title || !content) {
            this.showMessage('제목과 내용을 모두 입력해주세요.', 'error');
            return;
        }

        const newNote = {
            id: this.nextId++,
            title,
            content,
            category,
            tags,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };

        this.notes.push(newNote);
        this.saveToStorage('notes', this.notes);
        
        // Clear form
        noteTitle.value = '';
        noteContent.value = '';
        noteTags.value = '';
        
        this.renderNotes();
        this.showMessage('노트가 저장되었습니다!', 'success');
    }

    searchNotes(query) {
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase()) ||
            note.category.toLowerCase().includes(query.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        this.renderNotes(filteredNotes);
    }

    renderNotes(notesToRender = this.notes) {
        const container = document.getElementById('notesList');
        if (!container) return;

        container.innerHTML = '';

        const sortedNotes = [...notesToRender].sort((a, b) => 
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        sortedNotes.forEach(note => {
            const noteEl = document.createElement('div');
            noteEl.className = 'note-item';
            noteEl.innerHTML = `
                <div class="note-header">
                    <div class="note-title">${note.title}</div>
                    <div class="note-category">${note.category}</div>
                </div>
                <div class="note-content">${note.content}</div>
                ${note.tags.length > 0 ? `
                    <div class="note-tags">
                        ${note.tags.map(tag => `<span class="note-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="note-date">${this.formatDate(note.updatedAt)}</div>
            `;
            container.appendChild(noteEl);
        });
    }

    // Project Management
    addProject() {
        const projectName = document.getElementById('projectName');
        const projectDescription = document.getElementById('projectDescription');
        const projectStartDate = document.getElementById('projectStartDate');
        const projectEndDate = document.getElementById('projectEndDate');
        const projectCategory = document.getElementById('projectCategory');

        if (!projectName || !projectDescription || !projectCategory) return;

        const name = projectName.value.trim();
        const description = projectDescription.value.trim();
        const startDate = projectStartDate.value;
        const endDate = projectEndDate.value;
        const category = projectCategory.value;

        if (!name || !description) {
            this.showMessage('프로젝트 이름과 설명을 입력해주세요.', 'error');
            return;
        }

        const newProject = {
            id: this.nextId++,
            name,
            description,
            progress: 0,
            status: "진행중",
            startDate: startDate || null,
            endDate: endDate || null,
            category
        };

        this.projects.push(newProject);
        this.saveToStorage('projects', this.projects);
        
        // Clear form
        projectName.value = '';
        projectDescription.value = '';
        projectStartDate.value = '';
        projectEndDate.value = '';
        
        this.renderProjects();
        this.updateDashboard();
        this.showMessage('프로젝트가 추가되었습니다!', 'success');
    }

    updateProjectProgress(id, progress) {
        const project = this.projects.find(p => p.id === id);
        if (project) {
            project.progress = Math.max(0, Math.min(100, progress));
            project.status = project.progress === 100 ? '완료' : '진행중';
            this.saveToStorage('projects', this.projects);
            this.renderProjects();
            this.updateDashboard();
        }
    }

    renderProjects() {
        const container = document.getElementById('projectsList');
        if (!container) return;

        container.innerHTML = '';

        this.projects.forEach(project => {
            const projectEl = document.createElement('div');
            projectEl.className = 'project-item';
            projectEl.innerHTML = `
                <div class="project-header">
                    <div class="project-name">${project.name}</div>
                    <div class="project-description">${project.description}</div>
                    ${project.startDate || project.endDate ? `
                        <div class="project-meta">
                            ${project.startDate ? `<span>시작: ${this.formatDate(project.startDate)}</span>` : ''}
                            ${project.endDate ? `<span>종료: ${this.formatDate(project.endDate)}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <div class="goal-progress">${project.progress}% 완료</div>
                <div class="project-status ${project.status === '완료' ? 'completed' : 'in-progress'}">${project.status}</div>
                <div style="margin-top: 8px; display: flex; gap: 8px;">
                    <button class="btn btn--secondary btn--sm" onclick="app.updateProjectProgress(${project.id}, ${project.progress + 10})">+10%</button>
                    <button class="btn btn--secondary btn--sm" onclick="app.updateProjectProgress(${project.id}, ${project.progress - 10})">-10%</button>
                </div>
            `;
            container.appendChild(projectEl);
        });
    }

    // Journal Management
    addJournal() {
        const journalTitle = document.getElementById('journalTitle');
        const journalContent = document.getElementById('journalContent');
        const journalMood = document.getElementById('journalMood');
        const journalTags = document.getElementById('journalTags');

        if (!journalTitle || !journalContent || !journalMood) return;

        const title = journalTitle.value.trim();
        const content = journalContent.value.trim();
        const mood = journalMood.value;
        const tags = journalTags.value.split(',').map(tag => tag.trim()).filter(tag => tag);

        if (!title || !content) {
            this.showMessage('제목과 내용을 모두 입력해주세요.', 'error');
            return;
        }

        const newJournal = {
            id: this.nextId++,
            title,
            content,
            mood,
            date: new Date().toISOString().split('T')[0],
            tags
        };

        this.journals.push(newJournal);
        this.saveToStorage('journals', this.journals);
        
        // Clear form
        journalTitle.value = '';
        journalContent.value = '';
        journalTags.value = '';
        
        this.renderJournals();
        this.showMessage('일기가 저장되었습니다!', 'success');
    }

    renderJournals() {
        const container = document.getElementById('journalsList');
        if (!container) return;

        container.innerHTML = '';

        const sortedJournals = [...this.journals].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedJournals.forEach(journal => {
            const journalEl = document.createElement('div');
            journalEl.className = 'journal-item';
            journalEl.innerHTML = `
                <div class="journal-header">
                    <div class="journal-title">${journal.title}</div>
                    <div class="journal-date">${this.formatDate(journal.date)}</div>
                </div>
                <div class="journal-mood">${this.getMoodLabel(journal.mood)}</div>
                <div class="journal-content">${journal.content}</div>
                ${journal.tags.length > 0 ? `
                    <div class="journal-tags">
                        ${journal.tags.map(tag => `<span class="journal-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            `;
            container.appendChild(journalEl);
        });
    }

    getMoodLabel(mood) {
        const labels = {
            productive: '생산적',
            happy: '행복',
            reflective: '성찰적',
            challenging: '도전적',
            relaxed: '편안'
        };
        return labels[mood] || mood;
    }

    // Portfolio
    loadPortfolio() {
        const elements = {
            portfolioName: document.getElementById('portfolioName'),
            portfolioTitle: document.getElementById('portfolioTitle'),
            portfolioBio: document.getElementById('portfolioBio'),
            portfolioEmail: document.getElementById('portfolioEmail'),
            portfolioPhone: document.getElementById('portfolioPhone'),
            portfolioLocation: document.getElementById('portfolioLocation'),
            skillsList: document.getElementById('skillsList'),
            portfolioProjects: document.getElementById('portfolioProjects')
        };

        if (elements.portfolioName) elements.portfolioName.textContent = this.portfolio.name;
        if (elements.portfolioTitle) elements.portfolioTitle.textContent = this.portfolio.title;
        if (elements.portfolioBio) elements.portfolioBio.textContent = this.portfolio.summary;
        if (elements.portfolioEmail) elements.portfolioEmail.textContent = this.portfolio.email;
        if (elements.portfolioPhone) elements.portfolioPhone.textContent = this.portfolio.phone;
        if (elements.portfolioLocation) elements.portfolioLocation.textContent = this.portfolio.location;

        // Skills
        if (elements.skillsList) {
            elements.skillsList.innerHTML = '';
            this.portfolio.skills.forEach(skill => {
                const skillEl = document.createElement('div');
                skillEl.className = 'skill-tag';
                skillEl.textContent = skill;
                elements.skillsList.appendChild(skillEl);
            });
        }

        // Projects
        if (elements.portfolioProjects) {
            elements.portfolioProjects.innerHTML = '';
            this.portfolio.projects.forEach(project => {
                const projectEl = document.createElement('div');
                projectEl.className = 'portfolio-project';
                projectEl.textContent = project;
                elements.portfolioProjects.appendChild(projectEl);
            });
        }
    }

    // Analytics
    renderAnalytics() {
        this.updateAnalyticsStats();
        this.renderWeeklyChart();
    }

    updateAnalyticsStats() {
        const totalTodos = this.todos.length;
        const completedTodos = this.todos.filter(t => t.completed).length;
        const activeProjects = this.projects.filter(p => p.progress < 100).length;

        this.updateElement('totalTodos', totalTodos);
        this.updateElement('completedTodos', completedTodos);
        this.updateElement('activeProjects', activeProjects);
    }

    renderWeeklyChart() {
        const container = document.getElementById('weeklyChart');
        if (!container) return;

        container.innerHTML = '';

        const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
        const weeklyData = this.calculateWeeklyData();
        const maxValue = Math.max(...weeklyData, 1);

        weekDays.forEach((day, index) => {
            const barContainer = document.createElement('div');
            barContainer.style.position = 'relative';
            barContainer.style.flex = '1';
            barContainer.style.display = 'flex';
            barContainer.style.flexDirection = 'column';
            barContainer.style.alignItems = 'center';
            barContainer.style.height = '100%';

            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${(weeklyData[index] / maxValue) * 100}%`;

            const value = document.createElement('div');
            value.className = 'chart-value';
            value.textContent = weeklyData[index];

            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = day;

            bar.appendChild(value);
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            container.appendChild(barContainer);
        });
    }

    calculateWeeklyData() {
        // Sample weekly data for demonstration
        return [3, 5, 2, 7, 4, 1, 6];
    }

    // Excel Export functionality
    exportToExcel(type) {
        if (!window.XLSX) {
            this.showMessage('Excel 내보내기 라이브러리가 로드되지 않았습니다.', 'error');
            return;
        }

        let data = [];
        let filename = '';

        try {
            switch(type) {
                case 'todos':
                    data = this.todos.map(todo => ({
                        '제목': todo.text,
                        '우선순위': this.getPriorityLabel(todo.priority),
                        '완료상태': todo.completed ? '완료' : '미완료',
                        '마감일': todo.dueDate || '',
                        '카테고리': todo.category,
                        '생성일': todo.createdAt
                    }));
                    filename = '할일목록';
                    break;

                case 'events':
                    data = this.events.map(event => ({
                        '제목': event.title,
                        '날짜': event.date,
                        '시간': event.time,
                        '카테고리': event.category,
                        '실행가능': event.isActionable ? '예' : '아니오'
                    }));
                    filename = '캘린더일정';
                    break;

                case 'notes':
                    data = this.notes.map(note => ({
                        '제목': note.title,
                        '내용': note.content,
                        '카테고리': note.category,
                        '태그': note.tags.join(', '),
                        '생성일': note.createdAt,
                        '수정일': note.updatedAt
                    }));
                    filename = '노트';
                    break;

                case 'projects':
                    data = this.projects.map(project => ({
                        '프로젝트명': project.name,
                        '설명': project.description,
                        '진행률': project.progress + '%',
                        '상태': project.status,
                        '시작일': project.startDate || '',
                        '종료일': project.endDate || '',
                        '카테고리': project.category
                    }));
                    filename = '프로젝트';
                    break;

                case 'journal':
                    data = this.journals.map(journal => ({
                        '제목': journal.title,
                        '내용': journal.content,
                        '기분': this.getMoodLabel(journal.mood),
                        '날짜': journal.date,
                        '태그': journal.tags.join(', ')
                    }));
                    filename = '일기';
                    break;

                case 'all':
                    this.exportAllData();
                    return;

                default:
                    this.showMessage('알 수 없는 내보내기 형식입니다.', 'error');
                    return;
            }

            this.createAndDownloadExcel(data, filename);
        } catch (error) {
            console.error('Export error:', error);
            this.showMessage('Excel 내보내기 중 오류가 발생했습니다.', 'error');
        }
    }

    exportAllData() {
        try {
            const wb = window.XLSX.utils.book_new();

            // Add todos sheet
            const todosData = this.todos.map(todo => ({
                '제목': todo.text,
                '우선순위': this.getPriorityLabel(todo.priority),
                '완료상태': todo.completed ? '완료' : '미완료',
                '마감일': todo.dueDate || '',
                '카테고리': todo.category,
                '생성일': todo.createdAt
            }));
            const todosWS = window.XLSX.utils.json_to_sheet(todosData);
            window.XLSX.utils.book_append_sheet(wb, todosWS, '할일목록');

            // Add events sheet
            const eventsData = this.events.map(event => ({
                '제목': event.title,
                '날짜': event.date,
                '시간': event.time,
                '카테고리': event.category,
                '실행가능': event.isActionable ? '예' : '아니오'
            }));
            const eventsWS = window.XLSX.utils.json_to_sheet(eventsData);
            window.XLSX.utils.book_append_sheet(wb, eventsWS, '캘린더일정');

            // Add notes sheet
            const notesData = this.notes.map(note => ({
                '제목': note.title,
                '내용': note.content,
                '카테고리': note.category,
                '태그': note.tags.join(', '),
                '생성일': note.createdAt,
                '수정일': note.updatedAt
            }));
            const notesWS = window.XLSX.utils.json_to_sheet(notesData);
            window.XLSX.utils.book_append_sheet(wb, notesWS, '노트');

            // Add projects sheet
            const projectsData = this.projects.map(project => ({
                '프로젝트명': project.name,
                '설명': project.description,
                '진행률': project.progress + '%',
                '상태': project.status,
                '시작일': project.startDate || '',
                '종료일': project.endDate || '',
                '카테고리': project.category
            }));
            const projectsWS = window.XLSX.utils.json_to_sheet(projectsData);
            window.XLSX.utils.book_append_sheet(wb, projectsWS, '프로젝트');

            // Add journals sheet
            const journalsData = this.journals.map(journal => ({
                '제목': journal.title,
                '내용': journal.content,
                '기분': this.getMoodLabel(journal.mood),
                '날짜': journal.date,
                '태그': journal.tags.join(', ')
            }));
            const journalsWS = window.XLSX.utils.json_to_sheet(journalsData);
            window.XLSX.utils.book_append_sheet(wb, journalsWS, '일기');

            // Download
            const today = new Date().toISOString().split('T')[0];
            window.XLSX.writeFile(wb, `생산성대시보드_전체데이터_${today}.xlsx`);
            this.showMessage('전체 데이터가 Excel 파일로 내보내졌습니다!', 'success');
        } catch (error) {
            console.error('Export all data error:', error);
            this.showMessage('전체 데이터 내보내기 중 오류가 발생했습니다.', 'error');
        }
    }

    createAndDownloadExcel(data, filename) {
        try {
            const ws = window.XLSX.utils.json_to_sheet(data);
            const wb = window.XLSX.utils.book_new();
            window.XLSX.utils.book_append_sheet(wb, ws, filename);

            const today = new Date().toISOString().split('T')[0];
            window.XLSX.writeFile(wb, `${filename}_${today}.xlsx`);
            this.showMessage(`${filename} 데이터가 Excel 파일로 내보내졌습니다!`, 'success');
        } catch (error) {
            console.error('Create Excel error:', error);
            this.showMessage('Excel 파일 생성 중 오류가 발생했습니다.', 'error');
        }
    }

    // Backup and restore
    exportBackup() {
        try {
            const backupData = {
                todos: this.todos,
                goals: this.goals,
                events: this.events,
                notes: this.notes,
                projects: this.projects,
                journals: this.journals,
                portfolio: this.portfolio,
                exportDate: new Date().toISOString()
            };

            const dataStr = JSON.stringify(backupData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

            const exportFileDefaultName = `productivity_backup_${new Date().toISOString().split('T')[0]}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();

            this.showMessage('백업 파일이 다운로드되었습니다!', 'success');
        } catch (error) {
            console.error('Export backup error:', error);
            this.showMessage('백업 파일 생성 중 오류가 발생했습니다.', 'error');
        }
    }

    importBackup(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                
                // Validate backup data
                if (!backupData.todos || !backupData.events) {
                    throw new Error('Invalid backup file format');
                }

                // Confirm import
                if (confirm('백업 데이터를 가져오면 현재 데이터가 모두 대체됩니다. 계속하시겠습니까?')) {
                    this.todos = backupData.todos || [];
                    this.goals = backupData.goals || [];
                    this.events = backupData.events || [];
                    this.notes = backupData.notes || [];
                    this.projects = backupData.projects || [];
                    this.journals = backupData.journals || [];
                    this.portfolio = backupData.portfolio || this.portfolio;

                    // Save all data
                    this.syncData();
                    this.renderAll();
                    this.updateDashboard();

                    this.showMessage('백업 데이터가 성공적으로 가져와졌습니다!', 'success');
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showMessage('백업 파일을 가져오는 중 오류가 발생했습니다.', 'error');
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    }

    clearAllData() {
        if (confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            if (confirm('마지막 확인: 모든 할 일, 일정, 노트, 프로젝트, 일기가 삭제됩니다.')) {
                // Clear all data
                this.todos = [];
                this.goals = [];
                this.events = [];
                this.notes = [];
                this.projects = [];
                this.journals = [];

                // Clear localStorage
                ['todos', 'goals', 'events', 'notes', 'projects', 'journals'].forEach(key => {
                    localStorage.removeItem(key);
                });

                // Re-render everything
                this.renderAll();
                this.updateDashboard();

                this.showMessage('모든 데이터가 삭제되었습니다.', 'success');
            }
        }
    }

    // Utility functions
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('ko-KR');
        } catch (error) {
            return dateStr;
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());

        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);

        // Show message
        setTimeout(() => messageEl.classList.add('show'), 100);

        // Hide message after 3 seconds
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// Initialize the app
const app = new ProductivityDashboard();