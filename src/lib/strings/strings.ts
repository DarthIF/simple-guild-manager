export const basic = {
    subtitle: { en: 'Simple Guild Manager', pt: 'Simple Guild Manager' },

    home: { en: 'Home', pt: 'Inicio' },
    manage_org: { en: 'Manage Guild', pt: 'Gerenciar Guilda' },
    teams: { en: 'Teams', pt: 'Equipes' },
    commissions: { en: 'Commissions', pt: 'Comissões' },
    audit_log: { en: 'Audit Log', pt: 'Registro de Auditoria' },

    category_database: { en: 'Database', pt: 'Banco de dados' },

    export_data: { en: 'Export Data', pt: 'Exportar Dados' },
    import_data: { en: 'Import Data', pt: 'Importar Dados' },

    settings: { en: 'Webapp Settings', pt: 'Configurações do aplicativo da Web' },
    source_code: { en: 'Source Code', pt: 'Código Fonte' },
    about: { en: 'About', pt: 'Sobre' },

    undefined: { en: 'Undefined', pt: 'Indefinido' },
    error_warning: { en: 'Error warning', pt: 'Aviso de erro' },

    yes: { en: 'Yes', pt: 'Sim' },
    no: { en: 'No', pt: 'Não' },

    power: { en: 'Power: %s', pt: 'Poder: %s' },

    commission: { en: 'Commission', pt: 'Comissão' },
    manage: { en: 'Manage', pt: 'Gerenciar' },

    information: { en: 'Information', pt: 'Informação' },

    you: { en: 'You', pt: 'Você' },
}

export const action = {
    ok: { en: 'OK', pt: 'OK' },
    cancel: { en: 'Cancel', pt: 'Cancelar' },
    save: { en: 'Save', pt: 'Salvar' },
    delete: { en: 'Delete', pt: 'Excluir' },

    add_member: { en: 'Add member', pt: 'Adicionar membro' },
    delete_member: { en: 'Delete member', pt: 'Apagar o member' },

    delete_team: { en: 'Delete team?', pt: 'Excluir equipe?' },
}

export const errors = {
    unknown_error: { en: 'Unknown error', pt: 'Erro desconhecido' },

    invalid_name: { en: 'Invalid name', pt: 'Nome invalido' },
}



export const fragment_home = {
    /**
     * @deprecated
     */
    no_sync_alert: {
        en: 'The database is saved in your browser, and data is not synced between devices.',
        pt: 'O banco de dados fica salvo no seu navegador, e os dados não são sincronizados entre dispositivos.'
    },


    no_sync_greeting: {
        en: 'Welcome back',
        pt: 'Bem-vindo de volta'
    },
    no_sync_line_1: {
        en: 'The database is saved in your browser.',
        pt: 'O banco de dados fica salvo no seu navegador.'
    },
    no_sync_line_2: {
        en: 'Information is not synchronized between devices.',
        pt: 'As informações não são sincronizados entre dispositivos.'
    },


    database_greeting: {
        en: 'Welcome, %s',
        pt: 'Bem-vindo, %s'
    },
    database_line_1: {
        en: 'Information from %s database is synchronized.',
        pt: 'As informações do %s banco de dados  são sincronizadas.'
    },
    database_line_2: {
        en: 'Make changes carefully.',
        pt: 'Faça alterações com cuidado.'
    },
}

export const fragment_manage = {
    title_changeOrgName: { en: 'Change Guild Name', pt: 'Mudar Nome da Guilda' },
    new_name: { en: 'New name', pt: 'Novo nome' },

    title_manageMembers: { en: 'Manage Members', pt: 'Gerenciar Membros' },

    title_membersList: { en: 'Member List (%s/%s)', pt: 'Lista de Membros (%s/%s)' },
}

export const fragment_teams = {
    dialog_new_team: { en: 'New team', pt: 'Nova equipe' },
    dialog_team_name: { en: 'Team name', pt: 'Nome da equipe' },

    no_teams: { en: 'No teams', pt: 'Sem equipes' },

    total_power: { en: 'Total power:', pt: 'Poder total:' },

    dialog_add_member: { en: 'Add member to team (%s)', pt: 'Adicionar membro à equipe (%s)' },
    no_free_members: { en: 'No members available', pt: 'Nenhum membro disponível' },
}

export const fragment_commissions = {
    dialog_prompt_missed: { en: 'Missed commissions', pt: 'Comissões perdidas' },

    missed_single: { en: '%s time', pt: '%s vez' },
    missed_plural: { en: '%s times', pt: '%s vezes' },

    action_close_today: { en: 'Close today', pt: 'Fechar hoje' },
    action_closed: { en: 'Mark as closed', pt: 'Marcar como fechado' },
    action_missed: { en: 'Lost the commission', pt: 'Perdeu a comissão' },
    action_available: { en: 'Mark as available', pt: 'Marcar como disponível' },
    action_inactive: { en: 'Mark as inactive', pt: 'Marcar como inativo' },

    confirm_reset_cycle: {
        en: 'Do you want to restart the commission cycle? This action will clear the list of closed commissions and cannot be undone.',
        pt: 'Deseja reiniciar o ciclo de comissões? Essa ação irá limpar a lista de quem fechou as comissões, e não pode ser desfeita.'
    },

    state: { en: 'State: %s', pt: 'Estado: %s' },
    date: { en: 'Date: %s', pt: 'Data: %s' },
    missed: { en: 'Missed: %s', pt: 'Perdido: %s' },
    last_closed: { en: 'Last closed: %s', pt: 'Último fechado: %s' },

    close_today: { en: 'Close today', pt: 'Fechar hoje' },
    lost_commission: { en: 'Lost the commission', pt: 'Perdeu a comissão' },
    mark_closed: { en: 'Mark as closed', pt: 'Marcar como fechado' },
    mark_available: { en: 'Make as available', pt: 'Deixar como disponível' },
    mark_inactive: { en: 'Mark as inactive', pt: 'Marcar como inativo' },
}

export const fragment_settings = {
    change_lang: { en: 'Change language', pt: 'Mudar idioma' },
    current_lang: { en: 'Current language: %s', pt: 'Idioma atual: %s' },
}



/**
 * @deprecated
 */
export const audit_logs = {
    change_organization_name: {
        en: 'Organization name changed from "%s" to "%s"',
        pt: 'Nome da organização alterado de "%s" para "%s"'
    },

    add_member: {
        en: 'Member added: %s (Power: %s)',
        pt: 'Membro adicionado: %s (Poder: %s)'
    },

    removed_member: {
        en: 'Member removed: %s (Power: %s)',
        pt: 'Membro removido: %s'
    },

    edited_member: {
        en: 'Edited member: %s (Power: %s)',
        pt: 'Membro editado: %s (Poder: %s)'
    },

    create_team: {
        en: 'Team %s was created',
        pt: 'Foi criada a equipe %s'
    },

    delete_team: {
        en: 'Team %s has been deleted.',
        pt: 'A equipe %s foi apagada.'
    },

    add_member_to_team: {
        en: 'Member %s added to team %s',
        pt: 'Membro %s adicionado à equipe %s'
    },

    remove_member_from_team: {
        en: 'Member %s removed from team %s',
        pt: 'Membro %s removido da equipe %s'
    },

    commission_reset_cycle: {
        en: 'The commission cycle has been restarted.',
        pt: 'O ciclo das comissões foi reiniciado.'
    },

    commission_set_state: {
        en: '%s has been added to the %s commissions list',
        pt: '%s foi incluído(a) na lista de comissões %s'
    }
}



export const input_file = {
    select_file: { en: 'Select file', pt: 'Selecionar arquivo' },
    file_size: { en: 'File size: %s KiB', pt: 'Tamanho do arquivo: %s KiB' },
}



export const database_strings = {
    commission_state_available: { en: 'Available', pt: 'Disponível' },
    commission_state_closed: { en: 'Closed', pt: 'Fechado' },
    commission_state_inactive: { en: 'Inactive', pt: 'Inativo' },

    import_data_invalid_type: {
        en: 'Please select a JSON file.',
        pt: 'Por favor, selecione um arquivo JSON.'
    },
    import_message: {
        en: 'This will replace all current data. Do you wish to continue?',
        pt: 'Isso substituirá todos os dados atuais. Deseja continuar?'
    },

    log_set_guild_name: { en: '%s updated guild %s', pt: '%s atualizou a guilda %s' },

    log_add_member: { en: '%s added member %s', pt: '%s adicionou o(a) membro(a) %s' },
    log_delete_member: { en: '%s deleted member %s', pt: '%s excluiu o(a) membro(a) %s' },
    log_edit_member: { en: '%s updated member %s', pt: '%s atualizou o(a) membro(a) %s' },

    log_create_team: { en: '%s created team [%s] for the %s event', pt: '%s criou a equipe [%s] para o evento %s' },
    log_delete_team: { en: '%s deleted team [%s] of %s event', pt: '%s excluiu a equipe [%s] do evento %s' },
    log_add_member_to_team: {
        en: '%s added %s to team [%s], on event %s',
        pt: '%s adicionou %s à equipe [%s], no evento %s'
    },
    log_remove_member_from_team: {
        en: '%s removed %s of team [%s], on event %s',
        pt: '%s removeu %s da equipe [%s], no evento %s'
    },

    log_commission_set_state: { en: '%s defined %s as %s', pt: '%s definiu %s como %s' },
    log_commission_reset_cycle: { en: '%s restarted the commission cycle', pt: '%s reiniciou o ciclo de comissão' },
}