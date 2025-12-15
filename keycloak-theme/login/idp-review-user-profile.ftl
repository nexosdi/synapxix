<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('firstName','lastName','email','username'); section>
    <#if section = "header">
        ${msg("loginIdpReviewProfileTitle")}
    <#elseif section = "form">
    <div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div class="layout-container flex h-full grow flex-col">
            <div class="flex flex-1 justify-center">
                <div class="layout-content-container flex flex-col w-full flex-1">
                    <div class="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                        <!-- Left Panel - Gradient Background -->
                        <div class="relative hidden lg:flex h-full flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-700">
                            <div class="relative z-10">
                                <a class="flex items-center gap-3" href="#">
                                    <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.437L19.531 8.5V15.5L12 19.563L4.469 15.5V8.5L12 4.437Z"></path>
                                    </svg>
                                    <span class="text-2xl font-bold tracking-tight text-white">Synapxix</span>
                                </a>
                            </div>
                            
                            <div class="relative z-10">
                                <p class="text-3xl font-bold tracking-tight text-white">¡Ya casi estás dentro!</p>
                                <p class="mt-2 text-white/80">Solo necesitamos confirmar algunos datos para completar tu registro.</p>
                            </div>
                        </div>

                        <!-- Right Panel - Form -->
                        <div class="flex items-center justify-center p-6 sm:p-12 bg-background-light dark:bg-background-dark">
                            <div class="w-full max-w-md space-y-8">
                                <div class="flex min-w-72 flex-col gap-2 text-center lg:text-left">
                                    <p class="text-[#0d131b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Completa tu Perfil</p>
                                    <p class="text-[#4c6c9a] dark:text-slate-400 text-base font-normal leading-normal">Verifica que tu información sea correcta.</p>
                                </div>

                                <#if message?has_content>
                                    <div class="p-4 rounded-lg ${(message.type == 'error')?then('bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800', 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800')}">
                                        ${message.summary?no_esc}
                                    </div>
                                </#if>

                                <form id="kc-idp-review-profile-form" action="${url.loginAction}" method="post">
                                    <div class="flex flex-col gap-6">
                                        <#if user.editUsernameAllowed>
                                            <label class="flex flex-col">
                                                <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Nombre de Usuario *</p>
                                                <input required type="text" id="username" name="username" value="${(user.username!'')}" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark px-3 py-2 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" placeholder="Elige un nombre de usuario único" aria-invalid="<#if messagesPerField.existsError('username')>true</#if>" />
                                                <#if messagesPerField.existsError('username')>
                                                    <span class="text-sm text-red-600 dark:text-red-400 mt-1">${kcSanitize(messagesPerField.get('username'))?no_esc}</span>
                                                </#if>
                                            </label>
                                        </#if>

                                        <label class="flex flex-col">
                                            <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Correo Electrónico</p>
                                            <input readonly type="email" id="email" name="email" value="${(user.email!'')}" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-base font-normal leading-normal text-slate-600 dark:text-slate-400 cursor-not-allowed" />
                                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Este correo proviene de tu cuenta de Google y no puede ser modificado.</p>
                                        </label>

                                        <div class="flex flex-col gap-4 md:flex-row">
                                            <label class="flex flex-1 flex-col">
                                                <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Nombre *</p>
                                                <input required type="text" id="firstName" name="firstName" value="${(user.firstName!'')}" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark px-3 py-2 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" placeholder="Tu nombre" aria-invalid="<#if messagesPerField.existsError('firstName')>true</#if>" />
                                                <#if messagesPerField.existsError('firstName')>
                                                    <span class="text-sm text-red-600 dark:text-red-400 mt-1">${kcSanitize(messagesPerField.get('firstName'))?no_esc}</span>
                                                </#if>
                                            </label>
                                            <label class="flex flex-1 flex-col">
                                                <p class="pb-2 text-sm font-medium leading-normal text-slate-800 dark:text-slate-200">Apellido *</p>
                                                <input required type="text" id="lastName" name="lastName" value="${(user.lastName!'')}" class="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark px-3 py-2 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" placeholder="Tu apellido" aria-invalid="<#if messagesPerField.existsError('lastName')>true</#if>" />
                                                <#if messagesPerField.existsError('lastName')>
                                                    <span class="text-sm text-red-600 dark:text-red-400 mt-1">${kcSanitize(messagesPerField.get('lastName'))?no_esc}</span>
                                                </#if>
                                            </label>
                                        </div>

                                        <button type="submit" class="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-base font-semibold leading-normal text-white transition-all duration-200 hover:bg-primary/90">
                                            Continuar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </#if>
</@layout.registrationLayout>
