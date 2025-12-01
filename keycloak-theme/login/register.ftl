<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">
    <div class="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div class="layout-container flex h-full grow flex-col">
            <div class="flex flex-1 items-stretch">
                <div class="flex w-full max-w-full">
                    <main class="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
                        <!-- Left Panel - YouTube Video -->
                        <div class="relative hidden lg:flex h-full flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-700">
                            <div class="relative z-10">
                                <a class="flex items-center gap-3" href="#">
                                    <!-- Espacio para logo futuro - Reemplaza el SVG con: <img src="${url.resourcesPath}/img/logo.png" alt="Synapxix" class="h-10 w-10" /> -->
                                    <svg class="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.437L19.531 8.5V15.5L12 19.563L4.469 15.5V8.5L12 4.437Z"></path>
                                    </svg>
                                    <span class="text-2xl font-bold tracking-tight text-white">Synapxix</span>
                                </a>
                            </div>
                            
                            <!-- YouTube Video Embed -->
                            <div class="relative z-10 flex-1 flex items-center justify-center py-8">
                                <div class="w-full max-w-2xl">
                                    <div class="relative w-full" style="padding-bottom: 56.25%;">
                                        <iframe 
                                            class="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl"
                                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=0&controls=1&loop=1&playlist=dQw4w9WgXcQ" 
                                            title="YouTube video player" 
                                            frameborder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            allowfullscreen>
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="relative z-10">
                                <h2 class="text-4xl font-bold leading-tight text-white">¡Únete a la diversión!</h2>
                                <p class="max-w-md text-lg text-white/80">Crea tu cuenta y comienza a jugar, aprender y hacer nuevos amigos.</p>
                            </div>
                        </div>

                        <!-- Right Panel - Form -->
                        <div class="flex items-center justify-center bg-background-light dark:bg-background-dark p-6 lg:p-12">
                            <div class="flex w-full max-w-md flex-col gap-8">
                                <div class="flex flex-col gap-3 text-center lg:text-left">
                                    <p class="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">Crear Cuenta</p>
                                    <p class="text-base font-normal leading-normal text-slate-500 dark:text-slate-400">Comienza tu viaje con nosotros hoy.</p>
                                </div>

                                <#if message?has_content>
                                    <div class="p-4 rounded-lg ${(message.type == 'error')?then('bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800', 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800')}">
                                        ${message.summary?no_esc}
                                    </div>
                                </#if>

                                <form id="kc-register-form" action="${url.registrationAction}" method="post">
                                    <div class="flex flex-col gap-6">
                                        <div class="flex flex-col gap-4 md:flex-row">
                                            <label class="flex flex-1 flex-col">
                                                <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Nombre *</p>
                                                <input required type="text" id="firstName" name="firstName" value="${(register.formData.firstName!'')}" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark px-3 py-2 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" placeholder="Ingresa tu nombre" />
                                            </label>
                                            <label class="flex flex-1 flex-col">
                                                <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Apellido *</p>
                                                <input required type="text" id="lastName" name="lastName" value="${(register.formData.lastName!'')}" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark px-3 py-2 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" placeholder="Ingresa tu apellido" />
                                            </label>
                                        </div>

                                        <label class="flex flex-col">
                                            <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Correo Electrónico *</p>
                                            <input required type="email" id="email" name="email" value="${(register.formData.email!'')}" autocomplete="email" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark px-3 py-2 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" placeholder="tu@ejemplo.com" />
                                        </label>

                                        <#if !realm.registrationEmailAsUsername>
                                            <label class="flex flex-col">
                                                <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Usuario *</p>
                                                <input required type="text" id="username" name="username" value="${(register.formData.username!'')}" autocomplete="username" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark px-3 py-2 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" placeholder="Elige un nombre de usuario único" />
                                            </label>
                                        </#if>

                                        <#if passwordRequired??>
                                            <label class="flex flex-col">
                                                <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Contraseña *</p>
                                                <div class="relative flex w-full flex-1 items-stretch">
                                                    <input required type="password" id="password" name="password" autocomplete="new-password" minlength="8" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark py-2 pl-3 pr-10 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" placeholder="Mínimo 8 caracteres" />
                                                    <button type="button" onclick="togglePassword('password', this)" class="absolute inset-y-0 right-0 flex cursor-pointer items-center justify-center pr-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <span class="material-symbols-outlined text-xl eye-open">visibility</span>
                                                        <span class="material-symbols-outlined text-xl eye-closed hidden">visibility_off</span>
                                                    </button>
                                                </div>
                                            </label>

                                            <label class="flex flex-col">
                                                <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Confirmar Contraseña *</p>
                                                <div class="relative flex w-full flex-1 items-stretch">
                                                    <input required type="password" id="password-confirm" name="password-confirm" minlength="8" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark py-2 pl-3 pr-10 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" placeholder="Confirma tu contraseña" />
                                                    <button type="button" onclick="togglePassword('password-confirm', this)" class="absolute inset-y-0 right-0 flex cursor-pointer items-center justify-center pr-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <span class="material-symbols-outlined text-xl eye-open">visibility</span>
                                                        <span class="material-symbols-outlined text-xl eye-closed hidden">visibility_off</span>
                                                    </button>
                                                </div>
                                            </label>
                                        </#if>

                                        <#if recaptchaRequired??>
                                            <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                                        </#if>

                                        <button type="submit" class="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-base font-semibold leading-normal text-white transition-all duration-200 hover:bg-primary/90">
                                            Registrarse
                                        </button>

                                        <p class="text-center text-sm text-slate-500 dark:text-slate-400">
                                            ¿Ya tienes una cuenta? <a class="font-semibold text-primary hover:underline" href="${url.loginUrl}">Iniciar sesión</a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </div>

    <script>
        function togglePassword(inputId, button) {
            const input = document.getElementById(inputId);
            const eyeOpen = button.querySelector('.eye-open');
            const eyeClosed = button.querySelector('.eye-closed');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeOpen.classList.remove('hidden');
                eyeClosed.classList.add('hidden');
            }
        }
    </script>
    </#if>
</@layout.registrationLayout>