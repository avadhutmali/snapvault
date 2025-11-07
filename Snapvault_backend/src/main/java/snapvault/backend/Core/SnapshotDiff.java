package snapvault.backend.Core;

import java.util.ArrayList;
import java.util.List;

public class SnapshotDiff {
    List<String> added = new ArrayList<>();
    List<String> deleted = new ArrayList<>();
    List<String> modified = new ArrayList<>();

    public List<String> getAdded() {
        return added;
    }
    public void setAdded(List<String> added) {
        this.added = added;
    }
    public List<String> getDeleted() {
        return deleted;
    }
    public void setDeleted(List<String> deleted) {
        this.deleted = deleted;
    }
    public List<String> getModified() {
        return modified;
    }
    public void setModified(List<String> modified) {
        this.modified = modified;
    }
}
