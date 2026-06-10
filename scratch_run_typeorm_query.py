import sqlite3

db_path = 'D:\\n8n\\database.sqlite'

query = """
SELECT 
  "WorkflowEntity"."updatedAt" AS "WorkflowEntity_updatedAt", 
  "WorkflowEntity"."createdAt" AS "WorkflowEntity_createdAt", 
  "WorkflowEntity"."id" AS "WorkflowEntity_id", 
  "WorkflowEntity"."name" AS "WorkflowEntity_name", 
  "WorkflowEntity"."description" AS "WorkflowEntity_description", 
  "WorkflowEntity"."active" AS "WorkflowEntity_active", 
  "WorkflowEntity"."isArchived" AS "WorkflowEntity_isArchived", 
  "WorkflowEntity"."nodes" AS "WorkflowEntity_nodes", 
  "WorkflowEntity"."connections" AS "WorkflowEntity_connections", 
  "WorkflowEntity"."settings" AS "WorkflowEntity_settings", 
  "WorkflowEntity"."staticData" AS "WorkflowEntity_staticData", 
  "WorkflowEntity"."meta" AS "WorkflowEntity_meta", 
  "WorkflowEntity"."pinData" AS "WorkflowEntity_pinData", 
  "WorkflowEntity"."versionId" AS "WorkflowEntity_versionId", 
  "WorkflowEntity"."activeVersionId" AS "WorkflowEntity_activeVersionId", 
  "WorkflowEntity"."versionCounter" AS "WorkflowEntity_versionCounter", 
  "WorkflowEntity"."triggerCount" AS "WorkflowEntity_triggerCount", 
  "WorkflowEntity"."parentFolderId" AS "WorkflowEntity_parentFolderId", 
  "WorkflowEntity__WorkflowEntity_shared"."updatedAt" AS "WorkflowEntity__WorkflowEntity_shared_updatedAt", 
  "WorkflowEntity__WorkflowEntity_shared"."createdAt" AS "WorkflowEntity__WorkflowEntity_shared_createdAt", 
  "WorkflowEntity__WorkflowEntity_shared"."role" AS "WorkflowEntity__WorkflowEntity_shared_role", 
  "WorkflowEntity__WorkflowEntity_shared"."workflowId" AS "WorkflowEntity__WorkflowEntity_shared_workflowId", 
  "WorkflowEntity__WorkflowEntity_shared"."projectId" AS "WorkflowEntity__WorkflowEntity_shared_projectId", 
  "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project"."updatedAt" AS "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project_updatedAt", 
  "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project"."createdAt" AS "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project_createdAt", 
  "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project"."id" AS "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project_id", 
  "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project"."name" AS "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project_name", 
  "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project"."type" AS "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project_type", 
  "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project"."icon" AS "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project_icon", 
  "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project"."description" AS "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project_description", 
  "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project"."creatorId" AS "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project_creatorId", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."updatedAt" AS "WorkflowEntity__WorkflowEntity_activeVersion_updatedAt", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."createdAt" AS "WorkflowEntity__WorkflowEntity_activeVersion_createdAt", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."versionId" AS "WorkflowEntity__WorkflowEntity_activeVersion_versionId", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."workflowId" AS "WorkflowEntity__WorkflowEntity_activeVersion_workflowId", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."nodes" AS "WorkflowEntity__WorkflowEntity_activeVersion_nodes", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."connections" AS "WorkflowEntity__WorkflowEntity_activeVersion_connections", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."authors" AS "WorkflowEntity__WorkflowEntity_activeVersion_authors", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."name" AS "WorkflowEntity__WorkflowEntity_activeVersion_name", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."description" AS "WorkflowEntity__WorkflowEntity_activeVersion_description", 
  "WorkflowEntity__WorkflowEntity_activeVersion"."autosaved" AS "WorkflowEntity__WorkflowEntity_activeVersion_autosaved" 
FROM "workflow_entity" "WorkflowEntity" 
LEFT JOIN "shared_workflow" "WorkflowEntity__WorkflowEntity_shared" 
  ON "WorkflowEntity__WorkflowEntity_shared"."workflowId"="WorkflowEntity"."id"  
LEFT JOIN "project" "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project" 
  ON "WorkflowEntity__WorkflowEntity_shared__WorkflowEntity__WorkflowEntity_shared_project"."id"="WorkflowEntity__WorkflowEntity_shared"."projectId"  
LEFT JOIN "workflow_history" "WorkflowEntity__WorkflowEntity_activeVersion" 
  ON "WorkflowEntity__WorkflowEntity_activeVersion"."versionId"="WorkflowEntity"."activeVersionId" 
WHERE ( (("WorkflowEntity"."id" = ?)) ) AND ( "WorkflowEntity"."id" IN (?) )
"""

def run():
    conn = sqlite3.connect(db_path)
    # Use DictRow-like description mapping
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Let's query for Parent Orchestrator Agent (MDJmNwCRbwcLvNjd)
    w_id = 'MDJmNwCRbwcLvNjd'
    cursor.execute(query, (w_id, w_id))
    row = cursor.fetchone()
    
    if row:
        print("Columns returned and their values:")
        for col_name in row.keys():
            val = row[col_name]
            if val is None:
                val_str = "NULL"
            elif isinstance(val, (str, bytes)) and len(str(val)) > 80:
                val_str = f"TEXT of length {len(str(val))} (starts with: {str(val)[:60]}...)"
            else:
                val_str = str(val)
            print(f"  {col_name} => {val_str}")
    else:
        print("No row returned.")
        
    conn.close()

if __name__ == '__main__':
    run()
