/* ============================================
   PEDDI MOVIE WEBSITE — JAVASCRIPT
   Interactivity: Countdown, Navbar, Sidebar,
   Gallery Lightbox, Scroll Animations, Sound
   ============================================ */

(function () {
    'use strict';

    /* ---- DOM ELEMENTS ---- */
    const navbar       = document.getElementById('navbar');
    const hamburger    = document.getElementById('hamburger');
    const sidebar      = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOvly  = document.getElementById('sidebarOverlay');
    const soundBtn     = document.getElementById('soundBtn');
    const soundIcon    = document.getElementById('soundIcon');
    const lightbox     = document.getElementById('lightbox');
    const lightboxImg  = document.getElementById('lightboxImg');
    const lightboxClose= document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const viewMoreBtn  = document.getElementById('viewMoreBtn');
    const lightboxDownload = document.getElementById('lightboxDownload');

    /* ======================================
       1. NAVBAR — Sticky + Active Section
    ====================================== */
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        updateActiveNav();
    });

    function updateActiveNav() {
        const sections = ['home', 'story', 'cast', 'gallery', 'videos', 'trailer', 'events'];
        let current = 'home';
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (window.scrollY >= el.offsetTop - 120) current = id;
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    /* ======================================
       2. SIDEBAR
    ====================================== */
    function openSidebar() {
        if (!sidebar || !sidebarOvly) return;
        sidebar.classList.add('open');
        sidebarOvly.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (!sidebar || !sidebarOvly) return;
        sidebar.classList.remove('open');
        sidebarOvly.classList.remove('active');
        document.body.style.overflow = '';
    }

    // expose to HTML onclick attributes
    window.closeSidebar = closeSidebar;

    /* ======================================
       CAST / CREW TAB SWITCHER
    ====================================== */
    window.switchCastTab = function(tab) {
        const castPanel   = document.getElementById('castPanel');
        const crewPanel   = document.getElementById('crewPanel');
        const castTabBtn  = document.getElementById('castTabBtn');
        const crewTabBtn  = document.getElementById('crewTabBtn');
        const subtitle    = document.getElementById('castSubtitle');

        if (tab === 'cast') {
            castPanel.style.display = '';
            crewPanel.style.display = 'none';
            castTabBtn.classList.add('active');
            crewTabBtn.classList.remove('active');
            if (subtitle) subtitle.textContent = 'Click on any cast member to know more';
        } else {
            castPanel.style.display = 'none';
            crewPanel.style.display = '';
            crewTabBtn.classList.add('active');
            castTabBtn.classList.remove('active');
            if (subtitle) subtitle.textContent = 'Click on any crew member to see their past works';
        }
    };

    if (hamburger)    hamburger.addEventListener('click', openSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOvly)  sidebarOvly.addEventListener('click', closeSidebar);

    // Scroll down indicator - Click to smooth scroll
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const infoSection = document.getElementById('info');
            if (infoSection) {
                infoSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        scrollIndicator.style.cursor = 'pointer';
    }

    // Close sidebar / lightbox / YouTube modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
            if (lightbox && lightbox.classList.contains('active')) closeLightbox();
            // closeYTModal is defined later but closure captures it fine
            const ytM = document.getElementById('ytModal');
            if (ytM && ytM.style.display !== 'none') {
                document.getElementById('ytFrame').src = '';
                ytM.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    });

    /* ======================================
       3. COUNTDOWN TIMER
    ====================================== */
    // Target: June 4 2026 — Worldwide Release
    const releaseDate = new Date('2026-06-04T00:00:00');

    function updateCountdown() {
        // Only update if countdown elements exist (on index.html)
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
            return; // Countdown elements not on this page
        }

        const now  = new Date();
        const diff = releaseDate - now;

        if (diff <= 0) {
            daysEl.textContent    = '000';
            hoursEl.textContent   = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent    = String(days).padStart(3, '0');
        hoursEl.textContent   = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* ======================================
       4. SCROLL FADE-IN ANIMATIONS
    ====================================== */
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger siblings for a cascade effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => observer.observe(el));

    /* ======================================
       5. GALLERY LIGHTBOX
       (only runs on pages that have lightbox elements)
    ====================================== */
    const galleryImages = [];
    let currentLightboxIndex = 0;

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        currentLightboxIndex = index;
        lightboxImg.src = galleryImages[index].src;
        lightboxImg.alt = galleryImages[index].alt;
        if (lightboxDownload) {
            lightboxDownload.href = galleryImages[index].src;
            lightboxDownload.setAttribute('download', galleryImages[index].alt || 'peddi-image');
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function lightboxNavigate(direction) {
        if (!lightboxImg) return;
        currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.src = galleryImages[currentLightboxIndex].src;
            lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
            if (lightboxDownload) {
                lightboxDownload.href = galleryImages[currentLightboxIndex].src;
                lightboxDownload.setAttribute('download', galleryImages[currentLightboxIndex].alt || 'peddi-image');
            }
            lightboxImg.style.opacity = 1;
        }, 150);
    }

    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        const img = item.querySelector('.gallery-img');
        if (!img) return;
        galleryImages.push({ src: img.src, alt: img.alt });
        item.addEventListener('click', () => openLightbox(index));
    });

    // Only attach lightbox controls if they exist on this page
    if (lightbox && lightboxImg) {
        lightboxImg.style.transition = 'opacity 0.15s';
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev)  lightboxPrev.addEventListener('click', () => lightboxNavigate(-1));
        if (lightboxNext)  lightboxNext.addEventListener('click', () => lightboxNavigate(1));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'ArrowLeft')  lightboxNavigate(-1);
            if (e.key === 'ArrowRight') lightboxNavigate(1);
        });
    }

    /* ======================================
       6. VIEW MORE BUTTON
    ====================================== */
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.gallery-item-hidden');
            hiddenItems.forEach(item => {
                item.classList.remove('gallery-item-hidden');
                // Re-trigger fade-in observer for newly visible items
                item.classList.remove('visible');
                observer.observe(item);
            });
            viewMoreBtn.textContent = '\u2713 ALL PHOTOS SHOWN';
            viewMoreBtn.disabled = true;
            viewMoreBtn.style.opacity = '0.6';
            viewMoreBtn.style.cursor = 'default';
        });
    }

    /* ======================================
       7. SOUND TOGGLE — Persistent Across Pages
    ====================================== */
    
    const bgAudio = document.getElementById('bgAudio');
    
    // Mute icon (crossed speaker)
    const muteIcon = 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z';
    
    // Unmute icon (speaker playing)
    const unmuteIcon = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z';
    
    if (!bgAudio || !soundBtn || !soundIcon) {
        console.log('Sound elements not found on this page');
    } else {
        // Setup audio
        bgAudio.volume = 0.5;
        
        // Get saved state - using localStorage for persistence across pages
        let isMuted = localStorage.getItem('peddi_audio_muted') === 'true';
        
        // Set initial icon
        function updateIcon() {
            const path = soundIcon.querySelector('path');
            if (path) {
                if (isMuted) {
                    path.setAttribute('d', muteIcon);
                    soundBtn.title = 'Unmute';
                    soundBtn.style.animation = 'pulseSoundBtn 2.5s ease-in-out infinite';
                } else {
                    path.setAttribute('d', unmuteIcon);
                    soundBtn.title = 'Mute';
                    soundBtn.style.animation = 'none';
                }
            }
        }
        
        // Initialize icon
        updateIcon();
        
        // Set initial volume based on muted state
        bgAudio.volume = isMuted ? 0 : 0.5;
        
        // PERSIST PLAYBACK TIME: Restore music position on page load
        bgAudio.addEventListener('canplay', () => {
            const savedTime = localStorage.getItem('peddi_audio_time');
            if (savedTime) {
                bgAudio.currentTime = parseFloat(savedTime);
            }
        }, { once: true });
        
        // SAVE PLAYBACK TIME: Save current position every 5 seconds and on page unload
        setInterval(() => {
            if (!bgAudio.paused && !isMuted) {
                localStorage.setItem('peddi_audio_time', bgAudio.currentTime);
            }
        }, 5000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            if (!bgAudio.paused && !isMuted) {
                localStorage.setItem('peddi_audio_time', bgAudio.currentTime);
            }
        });
        
        // AUTO-PLAY: Start music immediately when page loads
        // This respects the autoplay attribute on the audio element
        bgAudio.play().catch(() => {
            console.log('Autoplay was blocked by browser. Music will start on user interaction.');
            // If autoplay is blocked, start on first user interaction
            const startOnInteraction = () => {
                bgAudio.play().catch(() => {});
                document.removeEventListener('click', startOnInteraction);
                document.removeEventListener('touchstart', startOnInteraction);
                document.removeEventListener('keydown', startOnInteraction);
            };
            document.addEventListener('click', startOnInteraction, { once: true });
            document.addEventListener('touchstart', startOnInteraction, { once: true });
            document.addEventListener('keydown', startOnInteraction, { once: true });
        });
        
        // Button click handler
        soundBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            localStorage.setItem('peddi_audio_muted', isMuted);
            
            if (isMuted) {
                // Mute
                bgAudio.volume = 0;
                // Save current time when muting
                localStorage.setItem('peddi_audio_time', bgAudio.currentTime);
            } else {
                // Unmute
                bgAudio.volume = 0.5;
                if (bgAudio.paused) {
                    bgAudio.play().catch(() => {});
                }
            }
            
            updateIcon();
        });
    }

    /* ======================================
       8. VIDEO PLAY BUTTON INTERACTION
    ====================================== */

    // Create YouTube modal overlay (injected once into the DOM)
    const ytModal = document.createElement('div');
    ytModal.id = 'ytModal';
    Object.assign(ytModal.style, {
        display: 'none',
        position: 'fixed',
        inset: '0',
        background: 'rgba(0,0,0,0.88)',
        zIndex: '99999',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    });
    ytModal.innerHTML = `
        <div style="position:relative;width:90%;max-width:860px;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;">
            <iframe id="ytFrame" src="" allow="autoplay; encrypted-media" allowfullscreen
                style="width:100%;height:100%;border:none;"></iframe>
        </div>
        <button id="ytModalClose" style="margin-top:18px;background:#e00e2f;color:#fff;border:none;
            border-radius:50px;padding:10px 30px;font-size:1rem;cursor:pointer;font-family:Montserrat,sans-serif;font-weight:700;"
            aria-label="Close video">✕ Close</button>
    `;
    document.body.appendChild(ytModal);

    const ytFrame = document.getElementById('ytFrame');
    const ytModalClose = document.getElementById('ytModalClose');

    function openYTModal(videoId) {
        // Validate video ID - skip if it contains placeholder text or is invalid
        if (!videoId || videoId.includes('YOUTUBE') || videoId.includes('_ID') || videoId.length < 10) {
            showToast('🎬 Trailer coming soon! Stay tuned for official videos.');
            return;
        }

        // Open YouTube video in a new tab (most reliable method)
        // This works regardless of embedding restrictions or CORS issues
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
    }

    function closeYTModal() {
        ytFrame.src = ''; // stops the video
        ytModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    ytModalClose.addEventListener('click', closeYTModal);
    ytModal.addEventListener('click', (e) => { if (e.target === ytModal) closeYTModal(); });

    // Hook up all video placeholders
    document.querySelectorAll('.video-placeholder').forEach(placeholder => {
        const videoId = placeholder.dataset.video;

        // Skip placeholders without a real YouTube ID or with placeholder text
        if (!videoId || videoId.startsWith('YOUTUBE') || videoId.includes('_ID')) {
            placeholder.style.cursor = 'default'; // Not clickable
            return;
        }

        placeholder.style.cursor = 'pointer';

        // Make the entire placeholder (thumbnail + play button) clickable
        placeholder.addEventListener('click', () => openYTModal(videoId));
    });

    /* ======================================
       9. ADD REMINDER BUTTON
    ====================================== */
    const addReminderBtn = document.getElementById('addReminderBtn');
    if (addReminderBtn) {
        addReminderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Open Google Calendar event creation with PEDDI movie details
            const eventTitle = 'PEDDI Movie Release';
            const eventDate = '20260604'; // June 4, 2026
            const startTime = 'T053000'; // 5:30 AM
            const endTime = 'T230000'; // 11:00 PM
            const location = 'Theaters Worldwide';
            const description = 'The most anticipated Pan-India blockbuster PEDDI - starring Ram Charan, Janhvi Kapoor, and Shiva Rajkumar.';
            
            const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(eventTitle)}&dates=${eventDate}${startTime}/${eventDate}${endTime}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}`;
            
            window.open(calendarUrl, '_blank', 'noopener,noreferrer');
        });
    }

    function showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            background: 'linear-gradient(135deg, #8b0000, #e00e2f)',
            color: 'white',
            padding: '14px 24px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '600',
            zIndex: '99999',
            boxShadow: '0 8px 30px rgba(224, 14, 47, 0.5)',
            transform: 'translateX(150%)',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            maxWidth: '320px',
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        setTimeout(() => {
            toast.style.transform = 'translateX(150%)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    /* ======================================
       10. SMOOTH SCROLL FOR NAV LINKS
    ====================================== */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = 64; // navbar height
            const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        });
    });

    /* ======================================
       11. PARALLAX EFFECT ON HERO
    ====================================== */
    const heroBgImg = document.querySelector('.hero-bg-img');
    window.addEventListener('scroll', () => {
        if (!heroBgImg) return;
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroBgImg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
        }
    }, { passive: true });
    /* ======================================
       12. HYPE METER MODAL — Open/Close Control
    ====================================== */
    
    const hypeCardBtn = document.getElementById('hypeCardBtn');
    const hypeModal = document.getElementById('hypeModal');
    const hypeModalOverlay = document.getElementById('hypeModalOverlay');
    const hypeModalClose = document.getElementById('hypeModalClose');

    if (hypeCardBtn && hypeModal) {
        // Open modal when card is clicked
        hypeCardBtn.addEventListener('click', () => {
            hypeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close modal when close button is clicked
        hypeModalClose.addEventListener('click', () => {
            hypeModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close modal when overlay is clicked
        hypeModalOverlay.addEventListener('click', () => {
            hypeModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hypeModal.classList.contains('active')) {
                hypeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ======================================
       13. HYPE METER — Community Feedback (Supabase Integration)
    ====================================== */

    // Initialize Supabase
    const SUPABASE_URL = 'https://gsjetvpxpgwlkrteuctu.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_GPWvzrxxvTUYjx5PME0Ufg_hRlStohY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const hypeForm = document.getElementById('hypeForm');
    const hypeName = document.getElementById('hypeName');
    const hypeMessage = document.getElementById('hypeMessage');
    const hypeFeed = document.getElementById('hypeFeed');
    const charCount = document.getElementById('charCount');
    const totalHypesDisplay = document.getElementById('totalHypes');
    const avgRatingDisplay = document.getElementById('avgRating');
    const starInputs = document.querySelectorAll('.star-rating input');
    let allHypes = [];

    // Helper: Get initials from name
    function getInitials(name) {
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join('');
    }

    // Helper: Format date
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        } catch {
            return dateString;
        }
    }

    // Load hypes from Supabase
    async function loadHypes() {
        try {
            const { data, error } = await supabase
                .from('hypes')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error loading hypes:', error);
                return [];
            }
            allHypes = data || [];
            return allHypes;
        } catch (err) {
            console.error('Failed to load hypes:', err);
            return [];
        }
    }

    // Update character count
    if (hypeMessage) {
        hypeMessage.addEventListener('input', (e) => {
            charCount.textContent = e.target.value.length;
        });
    }

    // Handle form submission
    if (hypeForm) {
        hypeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get name
            const name = hypeName.value.trim();
            if (!name) {
                showToast('👤 Please enter your name!');
                return;
            }

            // Get selected rating
            const rating = document.querySelector('input[name="rating"]:checked');
            if (!rating) {
                showToast('⭐ Please select a star rating!');
                return;
            }

            const message = hypeMessage.value.trim();
            if (!message) {
                showToast('💬 Please write a review!');
                return;
            }

            // Disable button during submission
            const submitBtn = hypeForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Submitting...';

            try {
                // Insert into Supabase
                const { data, error } = await supabase
                    .from('hypes')
                    .insert([
                        {
                            name: name,
                            rating: parseInt(rating.value),
                            message: message
                        }
                    ])
                    .select();

                if (error) {
                    showToast('❌ Error submitting review. Try again!');
                    console.error('Supabase error:', error);
                } else {
                    // Reset form
                    hypeForm.reset();
                    charCount.textContent = '0';
                    starInputs.forEach(input => input.checked = false);
                    
                    // Reload and display
                    await loadHypes();
                    displayHypes();
                    showToast('🔥 Hype sent! Thanks for the love!');
                }
            } catch (err) {
                showToast('❌ Failed to submit. Check your connection!');
                console.error('Exception:', err);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = '📍 Submit Your Hype!';
            }
        });
    }

    // Display all hypes
    function displayHypes() {
        const total = allHypes.length;
        const avgRating = total > 0 ? (allHypes.reduce((sum, h) => sum + h.rating, 0) / total).toFixed(1) : 0;

        // Update stats
        totalHypesDisplay.textContent = total;
        avgRatingDisplay.textContent = avgRating;

        // Clear feed
        hypeFeed.innerHTML = '';

        if (total === 0) {
            hypeFeed.innerHTML = '<p class="hype-empty">No reviews yet. Be the first! 🎬</p>';
            return;
        }

        // Display each hype
        allHypes.forEach(hype => {
            const hypeItem = document.createElement('div');
            hypeItem.className = 'hype-item';
            
            const initials = getInitials(hype.name);
            const ratingStars = '⭐'.repeat(hype.rating);
            const formattedDate = formatDate(hype.created_at);
            
            hypeItem.innerHTML = `
                <div class="hype-item-avatar">${initials}</div>
                <div class="hype-item-content">
                    <div class="hype-item-header">
                        <div class="hype-item-user">
                            <span class="hype-item-name">${hype.name}</span>
                            <span class="hype-item-rating">${ratingStars}</span>
                        </div>
                        <div class="hype-item-date">${formattedDate}</div>
                    </div>
                    <div class="hype-item-message">"${hype.message}"</div>
                </div>
            `;
            hypeFeed.appendChild(hypeItem);
        });
    }

    // Subscribe to real-time changes
    function subscribeToHypes() {
        if (!supabase) return;
        
        supabase
            .channel('hypes-channel')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'hypes' },
                (payload) => {
                    allHypes.unshift(payload.new);
                    displayHypes();
                }
            )
            .subscribe();
    }

    // Initialize on page load
    if (hypeForm) {
        (async () => {
            await loadHypes();
            displayHypes();
            subscribeToHypes();
        })();
    }
    console.log('%c🎬 PEDDI — Official Website', 'color: #e00e2f; font-size: 1.4em; font-weight: bold;');
    console.log('%cStarring Ram Charan · Janhvi Kapoor · Shiva Rajkumar', 'color: #aaa; font-size: 0.9em;');

})();
