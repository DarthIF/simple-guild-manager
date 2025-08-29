export const basic = {
    subtitle: { en: 'Simple organization manager', pt: 'Gerenciador de organização simples' },

    manage_org: { en: 'Manage Organization', pt: 'Gerenciar Organização' },
    teams: { en: 'Teams', pt: 'Equipes' },
    commissions: { en: 'Commissions', pt: 'Comissões' },
    audit_log: { en: 'Audit Log', pt: 'Registro de Auditoria' },

    category_database: { en: 'Database', pt: 'Banco de dados' },

    export_data: { en: 'Export Data', pt: 'Exportar Dados' },
    import_data: { en: 'Import Data', pt: 'Importar Dados' },

    import_data_invalid_type: { en: 'Please select a JSON file.', pt: 'Por favor, selecione um arquivo JSON.' },

    undefined: { en: 'Undefined', pt: 'Indefinido' },
    error: { en: 'Error warning', pt: 'Aviso de erro' },

    yes: { en: 'Yes', pt: 'Sim' },
    no: { en: 'No', pt: 'Não' }
}

export const action = {
    ok: { en: 'OK', pt: 'OK' },
    cancel: { en: 'Cancel', pt: 'Cancelar' },
    save: { en: 'Save', pt: 'Salvar' },
    delete: { en: 'Delete', pt: 'Excluir' }
}



export const fragment_manage = {
    title_changeOrgName: { en: 'Change Organization Name', pt: 'Mudar Nome da Organização' },
    new_name: { en: 'New name', pt: 'Novo nome' },

    title_manageMembers: { en: 'Manage Members', pt: 'Gerenciar Membros' },

    title_membersList: { en: 'Member List (%s/30)', pt: 'Lista de Membros (%s/30)' },
}

export const fragment_teams = {
    dialog_new_team: { en: 'New team', pt: 'Nova equipe' },
    dialog_team_name: { en: 'Team name', pt: 'Nome da equipe' },

    dialog_delete_team: { en: 'Delete the team?', pt: 'Excluir o time?' },

    no_teams: { en: 'No teams', pt: 'Sem equipes' },

    error_invalid_name: { en: 'Invalid name', pt: 'Nome invalido' },
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
}



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



/**
 * @deprecated
 */
export const component_card_team = {
    add: { en: 'Add member', pt: 'Adicionar membro' },
    delete: { en: 'Delete team', pt: 'Apagar o time' },

    total_power: { en: 'Total power:', pt: 'Poder total:' },
}

/**
 * @deprecated
 */
export const dialog_add_member = {
    title: { en: 'Add member to team (%s)', pt: 'Adicionar membro à equipe (%s)' },
    no_free_members: { en: 'No members available', pt: 'Nenhum membro disponível' },
}


export const database_strings = {
    commission_state_available: { en: 'Available', pt: 'Disponível' },
    commission_state_closed: { en: 'Closed', pt: 'Fechado' },
    commission_state_inactive: { en: 'Inactive', pt: 'Inativo' },
}